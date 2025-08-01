import React from "react";
import { createOrder } from "../../services/orderServices";
import type { OrderProduct } from "../../graphql/types/product.types";
import type { OrderItem } from "../../graphql/types/order.types";

interface PlaceOrderButtonProps {
  orderProducts: OrderProduct[];
  onCartUpdate?: () => void;
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  orderProducts,
  onCartUpdate,
}) => {
  const handlePlaceOrder = async () => {
    const items: OrderItem[] = orderProducts.map((p) => ({
      product_id: p?.productDetails?.id,
      amount: p.quantity,
    }));

    try {
      const response: any = await createOrder(items);
      console.log("Order created:", response.createOrder);
      localStorage.clear();
      window.dispatchEvent(new Event("orderProductsUpdated"));
      onCartUpdate?.();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <button
      className="place-order-btn"
      onClick={handlePlaceOrder}
      disabled={orderProducts.length == 0}
      style={
        orderProducts.length === 0
          ? { backgroundColor: "gray", cursor: "not-allowed" }
          : {}
      }
    >
      place order
    </button>
  );
};

export default PlaceOrderButton;
