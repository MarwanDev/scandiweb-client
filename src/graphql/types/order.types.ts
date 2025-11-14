export interface OrderItem {
    product_id?: string;
    amount?: number;
}

export interface CreateOrderResponse {
  createOrder: {
    id: number;
    status: string;
  };
}
