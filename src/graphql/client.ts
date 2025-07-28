import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.VITE_API_URL;

const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
