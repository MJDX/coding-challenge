import {
  ApolloClient,
  InMemoryCache,
  // createHttpLink,
  NormalizedCacheObject,
  ApolloLink,
  concat,
  HttpLink,
  Observable,
} from '@apollo/client/core';
import fetch from 'cross-fetch';
import { useAuthStore } from '../store/store';
import { Subscription } from 'zen-observable-ts';

// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000',
//   fetch,
// });


const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
  fetch,
});

// const authMiddleware = new ApolloLink((operation, forward) => {
//   const accessToken = useAuthStore().accessToken;
//   operation.setContext({
//     headers: {
//       authorization: accessToken ? `Bearer ${accessToken}` : "",
//     },
//   });
//   return forward(operation);
// });

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = useAuthStore().accessToken;
  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });
  return new Observable(observer => {
    let subscription: Subscription;
    
    // Start the operation and handle its result
    try {
      subscription = forward(operation).subscribe({
        next: response => {
          // console.log("response ###################### ");
          // console.log(response);
          
          // Check if the response indicates token expiration
          if (response.errors) {
            const tokenExpiredError = response.errors.find(
              error => error.message === 'Token has expired'
            );
            if (tokenExpiredError) {
              // Refresh the access token and retry the operation
              useAuthStore().refreshAccessToken();
              forward(operation).subscribe(observer);
            } else {
              observer.next(response);
            }
          } else {
            observer.next(response);
          }
        },
        error: async error => {
          // console.log("error ###################### ");
          // console.error(JSON.stringify(error, null, 2));
          // observer.error(error);
          
          if (error.networkError && error.networkError.result) {
            const errorMessages = error.networkError.result.errors.map((err: { message: any; }) => err.message);
            if (errorMessages.includes("TOKEN_EXPIRED")) {
              // Refresh the access token and retry the operation
              await useAuthStore().refreshAccessToken();
              forward(operation).subscribe(observer);
            } else {
              observer.error(error);
            }
          } else {
            observer.error(error);
          }
        },
        complete: () => {
          observer.complete();
        }
      });
    } catch (error) {
      // console.log("catch (error) ###################### ");
      // console.log(error);
      observer.error(error);
    }
    
    // Cleanup subscription when unsubscribed
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });
});



const cache = new InMemoryCache();


export const apolloClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });

