import { CREATE_ORDER_MUTATION } from '../graphql/mutations/createOrder';
import type { OrderItem } from '../graphql/types/order.types';
import client from '../graphql/client';

export const createOrder = async (items: OrderItem[]) => {
  const variables = { items };
  return await client.request(CREATE_ORDER_MUTATION, variables);
};
