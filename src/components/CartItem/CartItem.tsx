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
  const renderAttribute = (attributeName: string, selectedIndex?: number) => {
    const filteredItems = product?.productDetails?.attributes.filter(
      (item) => item.name === attributeName
    );
    if (
      !product?.productDetails?.attributes?.some(
        (attr) => attr.name == attributeName
      )
    )
      return null;

    return (
      <div
        data-testid={`cart-item-attribute-${attributeName.replace(
          " ",
          "-".toLowerCase()
        )}`}
      >
        <h4 className="prod-info-header">{attributeName}:</h4>
        <div className="item-sizes">
          {filteredItems && (
            <h5
              className={
                attributeName.toLowerCase() == "size" ? "size" : "capacity"
              }
              data-testid={`cart-item-attribute-${attributeName.replace(
                " ",
                "-".toLowerCase()
              )}-${attributeName.replace(" ", "-".toLowerCase())}-selected`}
            >
              {filteredItems[0]?.items[selectedIndex || 0]?.value}
            </h5>
          )}
          {filteredItems &&
            filteredItems[0]?.items
              .filter((_, idx) => idx !== (selectedIndex || 0))
              .map((item, idx) => (
                <h5
                  key={idx}
                  className={
                    attributeName.toLowerCase() == "size" ? "size" : "capacity"
                  }
                >
                  {item.value}
                </h5>
              ))}
        </div>
      </div>
    );
  };

  const renderColor = () => {
    if (
      !product?.productDetails?.attributes.some((attr) => attr.name === "Color")
    )
      return null;
    const colorItems = product?.productDetails?.attributes.filter(
      (item) => item.name === "Color"
    )[0].items;
    const selected = colorItems[product.colorIndex || 0];
    const otherColors = colorItems.filter(
      (_, idx) => idx !== product.colorIndex
    );

    return (
      <div>
        <h4 className="prod-info-header">Color:</h4>
        <div className="item-colors">
          <div
            style={{ height: 24, width: 24, backgroundColor: selected?.value }}
          ></div>
          {otherColors.map((color, index) => (
            <div
              key={index}
              style={{
                height: 24,
                width: 24,
                backgroundColor: color.value,
                cursor: "pointer",
                opacity: 0.6,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="cart-item-container">
      <div className="item-info">
        <h4 className="item-name">{product?.productDetails?.name}</h4>
        <h3
          className="item-price"
          style={{ fontFamily: `"Roboto", sans-serif` }}
          data-testid='cart-item-amount'
        >
          {product?.productDetails?.prices[0]?.currency_symbol}
          {product?.productDetails?.prices[0]?.amount}
        </h3>

        {renderAttribute("Size", product.sizeIndex)}
        {renderColor()}
        {renderAttribute("Capacity", product.capacityIndex)}
        {renderAttribute("With USB 3 ports", product.usbIndex)}
        {renderAttribute("Touch ID in keyboard", product.touchIdIndex)}
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
