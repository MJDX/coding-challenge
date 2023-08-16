import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client/core';
import fetch from 'cross-fetch';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
  fetch,
});
const cache = new InMemoryCache();

export const apolloClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    link: httpLink,
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
