import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cart.scss";
import type { OrderProduct } from "../../graphql/types/product.types";
import CartItem from "../CartItem/CartItem";

interface CartProps {
  orderProducts: OrderProduct[];
}

const Cart: React.FC<CartProps> = ({ orderProducts: initialOrderProducts }) => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);

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

  // const incrementQuantity = (productId: string) => {
  //   setOrderProducts((prev) =>
  //     prev.map((product) =>
  //       product?.productDetails?.id === productId
  //         ? {
  //             ...product,
  //             quantity: (product.quantity || 1) + 1,
  //             total:
  //               product?.productDetails?.prices[0]?.amount *
  //               ((product.quantity || 1) + 1),
  //           }
  //         : product
  //     )
  //   );
  // };

  // const decrementQuantity = (productId: string) => {
  //   setOrderProducts((prev) =>
  //     prev.map((product) =>
  //       product?.productDetails?.id === productId && (product.quantity || 1) > 1
  //         ? {
  //             ...product,
  //             quantity: (product.quantity || 1) - 1,
  //             total:
  //               product?.productDetails?.prices[0]?.amount *
  //               ((product.quantity || 1) - 1),
  //           }
  //         : product
  //     )
  //   );
  // };

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

  const calculateTotal = (): number => {
    return orderProducts.reduce(
      (acc, product) => acc + (product.total || 0),
      0
    );
  };

  const handlePlaceOrderClick = () => {
    axios({
      url: "http://localhost:8080/scandiweb-server/",
      method: "post",
      data: {
        query: `mutation { addOrder { id } }`,
      },
    })
      .then((res) => {
        console.log(res.data);
        localStorage.clear();
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error executing mutation:", err.message);
      });
  };

  const cartTotal = calculateTotal();

  let itemsText = "You have no items";
  if (orderProducts.length === 1) {
    itemsText = "1 item";
  } else if (orderProducts.length > 1) {
    itemsText = `${orderProducts.length} items`;
  }

  // const renderAttribute = (
  //   product: OrderProduct,
  //   attributeName: string,
  //   selectedIndex?: number
  // ) => {
  //   const filteredItems = product?.productDetails?.attributes.filter(
  //     (item) => item.name === attributeName
  //   );
  //   if (
  //     !product?.productDetails?.attributes?.some(
  //       (attr) => attr.name == attributeName
  //     )
  //   )
  //     return null;

  //   return (
  //     <div>
  //       <h4 className="prod-info-header">{attributeName}:</h4>
  //       <div className="item-sizes">
  //         {filteredItems && (
  //           <h5 className="capacity">
  //             {filteredItems[0]?.items[selectedIndex || 0]?.value}
  //           </h5>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // const renderColor = (product: OrderProduct) => {
  //   if (
  //     !product?.productDetails?.attributes.some((attr) => attr.name === "Color")
  //   )
  //     return null;
  //   const colorItems = product?.productDetails?.attributes.filter(
  //     (item) => item.name === "Color"
  //   )[0].items;
  //   const selected = colorItems[product.colorIndex || 0];

  //   return (
  //     <div>
  //       <h4 className="prod-info-header">Color:</h4>
  //       <div className="item-colors">
  //         <div
  //           style={{ height: 24, width: 24, backgroundColor: selected?.value }}
  //         ></div>
  //         {/* {colorItems
  //           .filter((_, i) => i !== (product.colorIndex || 0))
  //           .map((item, index) => (
  //             <div
  //               key={index}
  //               style={{
  //                 height: 24,
  //                 width: 24,
  //                 backgroundColor: item.value,
  //                 cursor: "pointer",
  //               }}
  //             ></div>
  //           ))} */}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="cart-container">
      <h3 className="items-count">
        My Bag,{" "}
        <span style={{ fontFamily: `"Roboto", sans-serif` }}>{itemsText}</span>
      </h3>

      <div className="cart-items">
        {orderProducts.map((product) => (
          <CartItem
            key={product?.productDetails?.id}
            product={product}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        ))}
      </div>

      <div className="cart-footer">
        <div className="total-info">
          <h3>Total</h3>
          <h3 style={{ fontFamily: `"Roboto", sans-serif` }}>
            ${Math.round(cartTotal * 100) / 100}
            {/* 3.55 */}
          </h3>
        </div>

        <button
          className="place-order-btn"
          onClick={handlePlaceOrderClick}
          disabled={orderProducts.length === 0}
          style={
            orderProducts.length === 0
              ? { backgroundColor: "gray", cursor: "not-allowed" }
              : {}
          }
        >
          place order
        </button>
      </div>
    </div>
  );
};

export default Cart;
