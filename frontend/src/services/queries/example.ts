import { apolloClient } from '../graphql';
import { gql } from 'graphql-tag';

export async function helloWorld() {
  const response = await apolloClient.query({
    query: gql`
      query Query {
        hello
      }
    `,
  });

  console.log(response.data.hello);
}
