import React, { useState, useEffect } from "react";
import "./Cart.scss";
import type { OrderProduct } from "../../graphql/types/product.types";
import CartItem from "../CartItem/CartItem";
import PlaceOrderButton from "../PlaceOrderButton/PlaceOrderButton";

interface CartProps {
  orderProducts: OrderProduct[];
}

const Cart: React.FC<CartProps> = ({ orderProducts: initialOrderProducts }) => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const total = orderProducts.reduce(
      (acc, product) =>
        acc +
        (Number(
          product?.quantity && product?.total
            ? product?.total * product?.quantity
            : product?.total
        ) || 0),
      0
    );
    setCartTotal(total);
  }, [orderProducts]);

  useEffect(() => {
    const initializedProducts = initialOrderProducts?.map((product) => ({
      ...product,
      quantity: product.quantity ? product.quantity : 1,
      total: product?.productDetails?.prices[0].amount,
    }));
    setOrderProducts(initializedProducts);
  }, [initialOrderProducts]);

  const areProductsEqual = (a: OrderProduct, b: OrderProduct): boolean => {
    return (
      a.productDetails?.id === b.productDetails?.id &&
      a.colorIndex === b.colorIndex &&
      a.sizeIndex === b.sizeIndex &&
      a.capacityIndex === b.capacityIndex &&
      a.usbIndex === b.usbIndex &&
      a.touchIdIndex === b.touchIdIndex
    );
  };

  const incrementQuantity = (targetProduct: OrderProduct) => {
    setOrderProducts((prev) => {
      const updated = prev.map((product) => {
        if (areProductsEqual(product, targetProduct)) {
          const newQuantity = (product.quantity || 1) + 1;
          const price = product.productDetails?.prices[0]?.amount || 0;
          return {
            ...product,
            quantity: newQuantity,
            total: price * newQuantity,
          };
        }
        return product;
      });

      localStorage.setItem("orderProducts", JSON.stringify(updated));
      window.dispatchEvent(new Event("orderProductsUpdated"));
      return updated;
    });
  };

  const decrementQuantity = (targetProduct: OrderProduct) => {
    setOrderProducts((prev) => {
      const updated = prev.map((product) => {
        if (
          areProductsEqual(product, targetProduct) &&
          (product.quantity || 1) > 1
        ) {
          const newQuantity = (product.quantity || 1) - 1;
          const price = product.productDetails?.prices[0]?.amount || 0;
          return {
            ...product,
            quantity: newQuantity,
            total: price * newQuantity,
          };
        }
        return product;
      });

      localStorage.setItem("orderProducts", JSON.stringify(updated));
      window.dispatchEvent(new Event("orderProductsUpdated"));
      return updated;
    });
  };

  let itemsText = "You have no items";
  if (orderProducts.length === 1) {
    itemsText = "1 item";
  } else if (orderProducts.length > 1) {
    itemsText = `${orderProducts.length} items`;
  }

  return (
    <div className="cart-container" data-testid="cart-overlay" onClick={(e) => e.stopPropagation()}>
      <h3 className="items-count">
        My Bag,{" "}
        <span style={{ fontFamily: `"Roboto", sans-serif` }}>{itemsText}</span>
      </h3>

      <div className="cart-items">
        {orderProducts.map((product, index) => (
          <CartItem
            key={index}
            product={product}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        ))}
      </div>

      <div className="cart-footer">
        <div className="total-info">
          <h3>Total</h3>
          <h3
            style={{ fontFamily: `"Roboto", sans-serif` }}
            data-testid="cart-total"
          >
            {typeof cartTotal == "number"
              ? `$${Math.round(cartTotal * 100) / 100}`
              : "N/A"}
          </h3>
        </div>
        <PlaceOrderButton orderProducts={orderProducts} />
      </div>
    </div>
  );
};

export default Cart;
