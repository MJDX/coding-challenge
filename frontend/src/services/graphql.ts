import {
  ApolloClient,
  InMemoryCache,
  // createHttpLink,
  NormalizedCacheObject,
  ApolloLink,
  concat,
  HttpLink,
} from '@apollo/client/core';
import fetch from 'cross-fetch';
import { useAuthStore } from '../store/store';

// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000',
//   fetch,
// });


const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
  fetch,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = useAuthStore().accessToken;
  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });
  return forward(operation);
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

