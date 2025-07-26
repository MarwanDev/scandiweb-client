import { gql } from 'graphql-request';

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($items: [OrderItemInput!]!) {
    createOrder(items: $items)
  }
`;
