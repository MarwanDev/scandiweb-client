import React from "react";
import type { OrderProduct } from "../../graphql/types/product.types";

interface CartItemProps {
  product: OrderProduct;
  incrementQuantity: (product: OrderProduct) => void;
  decrementQuantity: (product: OrderProduct) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  incrementQuantity,
  decrementQuantity,
}) => {
  const renderAttributes = () => {
    if (!product?.productDetails?.attributes) return null;

    return product.productDetails.attributes.map((attr, index) => {
      const normalizedKey = attr.name.toLowerCase().replace(/\s+/g, "_");
      const selectedIndex = product.attributes?.[normalizedKey] ?? 0;

      return (
        <div key={index}>
          <h4 className="prod-info-header">{attr.name}:</h4>

          {attr.type === "swatch" ? (
            <div className="item-colors">
              {attr.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    height: 24,
                    width: 24,
                    backgroundColor: item.value,
                    border:
                      idx === selectedIndex
                        ? "2px solid black"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </div>
          ) : (
            <div className="item-sizes">
              {attr.items.map((item, idx) => (
                <h5
                  key={idx}
                  className="text-attribute"
                  style={{
                    border:
                      idx === selectedIndex
                        ? "1px solid black"
                        : "1px solid #ccc",
                    padding: 4,
                    cursor: "pointer",
                  }}
                >
                  {item.value}
                </h5>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="cart-item-container">
      <div className="item-info">
        <h4 className="item-name">{product?.productDetails?.name}</h4>

        <h3 className="item-price" data-testid="cart-item-amount">
          {product?.productDetails?.prices[0]?.currency_symbol}
          {product?.productDetails?.prices[0]?.amount}
        </h3>

        {renderAttributes()}
      </div>

      <div className="item-options">
        <button
          className="option-button"
          onClick={() => incrementQuantity(product)}
          data-testid="cart-item-amount-increase"
        >
          +
        </button>
        <h5 className="item-count">{product.quantity}</h5>
        <button
          className="option-button"
          onClick={() => decrementQuantity(product)}
          data-testid="cart-item-amount-decrease"
        >
          -
        </button>
      </div>
      <img
        src={product?.productDetails?.gallery[0]?.image_url}
        alt="item-img"
        className="item-img"
      />
    </div>
  );
};

export default CartItem;
