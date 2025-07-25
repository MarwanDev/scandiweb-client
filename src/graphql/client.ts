import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:8090/scandiweb-server/public/index.php';

const client = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
