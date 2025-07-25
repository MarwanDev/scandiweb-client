import { gql } from 'graphql-request';

export const GET_ALL_CATEGORIES = gql`
  query {
    categories {
        name
        id
    }
  }
`;
