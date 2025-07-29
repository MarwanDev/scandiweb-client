import React, { useState, useEffect } from "react";
import "./ProductInfo.scss";
import parse from "html-react-parser";
import type { OrderProduct, Product } from "../../graphql/types/product.types";

interface ProductInfoProps {
  product: Product;
  onCartUpdate?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onCartUpdate }) => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [colorIndex, setColorIndex] = useState<number>(-1);
  const [sizeIndex, setSizeIndex] = useState<number>(-1);
  const [capacityIndex, setCapacityIndex] = useState<number>(-1);
  const [usbIndex, setUsbIndex] = useState<number>(-1);
  const [touchIdIndex, setTouchIdIndex] = useState<number>(-1);
  const [isProductInCart, setIsProductInCart] = useState<boolean>(false);
  const productSizeAttribute =
    product &&
    product.attributes &&
    product.attributes.some((item) => item.name == "Size")
      ? product.attributes.find((item) => item.name == "Size")
      : null;
  const productColorAttribute =
    product &&
    product.attributes &&
    product.attributes.some((item) => item.name == "Color")
      ? product.attributes.find((item) => item.name == "Color")
      : null;
  const productCapacityAttribute =
    product &&
    product.attributes &&
    product.attributes.some((item) => item.name == "Capacity")
      ? product.attributes.find((item) => item.name == "Capacity")
      : null;
  const productUSB3Attribute =
    product &&
    product.attributes &&
    product.attributes.some((item) => item.name == "With USB 3 ports")
      ? product.attributes.find((item) => item.name == "With USB 3 ports")
      : null;
  const productkeyboardTouchIdAttribute =
    product &&
    product.attributes &&
    product.attributes.some((item) => item.name == "Touch ID in keyboard")
      ? product.attributes.find((item) => item.name == "Touch ID in keyboard")
      : null;

  useEffect(() => {
    const storedProducts = localStorage.getItem("orderProducts");
    if (storedProducts) {
      setOrderProducts(JSON.parse(storedProducts));
    }
  }, []);

  useEffect(() => {
    const isInCart = orderProducts?.some(
      (item: any) => item.id === product.id && product.attributes.length == 0
    );
    setIsProductInCart(!!isInCart);
    console.log(isProductInCart);
  }, [orderProducts, product.id]);

  const handleClickAddToCart = () => {
    const updatedOrderProducts = [...orderProducts];

    const existingIndex = updatedOrderProducts.findIndex(
      (item: OrderProduct) =>
        item.productDetails?.id === product.id &&
        item.colorIndex === colorIndex &&
        item.sizeIndex === sizeIndex &&
        item.capacityIndex === capacityIndex &&
        item.usbIndex === usbIndex &&
        item.touchIdIndex === touchIdIndex
    );

    if (existingIndex !== -1) {
      // Product already exists with same attributes → increment quantity
      updatedOrderProducts[existingIndex].quantity =
        (updatedOrderProducts[existingIndex].quantity || 1) + 1;
    } else {
      // Product doesn't exist → add new with quantity = 1
      const updatedProduct: any = {
        productDetails: { ...product },
        colorIndex,
        sizeIndex,
        capacityIndex,
        usbIndex,
        touchIdIndex,
        quantity: 1,
      };
      updatedOrderProducts.push(updatedProduct);
    }

    setOrderProducts(updatedOrderProducts);
    localStorage.setItem("orderProducts", JSON.stringify(updatedOrderProducts));
    window.dispatchEvent(new Event("orderProductsUpdated"));

    onCartUpdate?.();
  };

  const productDescription = parse(
    product?.description.replace(/\\n/g, "") || ""
  );

  type AttributeName =
    | "colorIndex"
    | "sizeIndex"
    | "capacityIndex"
    | "usbIndex"
    | "touchIdIndex";

  const handleAttributeChange = (
    attribute: AttributeName,
    index: number,
    setter: (value: number) => void
  ) => {
    setter(index);

    const match = orderProducts?.some((item: any) => {
      return (
        item.id === product.id &&
        (attribute === "colorIndex"
          ? item.colorIndex === index
          : item.colorIndex === colorIndex) &&
        (attribute === "sizeIndex"
          ? item.sizeIndex === index
          : item.sizeIndex === sizeIndex) &&
        (attribute === "capacityIndex"
          ? item.capacityIndex === index
          : item.capacityIndex === capacityIndex) &&
        (attribute === "usbIndex"
          ? item.usbIndex === index
          : item.usbIndex === usbIndex) &&
        (attribute === "touchIdIndex"
          ? item.touchIdIndex === index
          : item.touchIdIndex === touchIdIndex)
      );
    });

    setIsProductInCart(match);
  };

  const areOptionsSelected =
    (productColorAttribute ? colorIndex > -1 : colorIndex == -1) &&
    (productCapacityAttribute ? capacityIndex > -1 : capacityIndex == -1) &&
    (productSizeAttribute ? sizeIndex > -1 : sizeIndex == -1) &&
    (productUSB3Attribute ? usbIndex > -1 : usbIndex == -1) &&
    (productkeyboardTouchIdAttribute ? touchIdIndex > -1 : touchIdIndex == -1);

  return (
    <div className="prod-info-container">
      <div className="item-info">
        <h4 className="prod-name">{product?.name}</h4>

        {productSizeAttribute && (
          <div data-testid="product-attribute-size">
            <h4 className="prod-info-header">Size:</h4>
            <div className="item-sizes">
              {productSizeAttribute?.items.map((item, index) => (
                <h5
                  className={sizeIndex == index ? "size size-active" : "size"}
                  key={index}
                  onClick={() =>
                    handleAttributeChange("sizeIndex", index, setSizeIndex)
                  }
                >
                  {item.value}
                </h5>
              ))}
            </div>
          </div>
        )}

        {productColorAttribute && (
          <div data-testid="product-attribute-color">
            <h4 className="prod-info-header">Color:</h4>
            <div className="item-colors">
              {productColorAttribute?.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    height: 24,
                    width: 24,
                    backgroundColor: item.value,
                    cursor: "pointer",
                  }}
                  className={colorIndex == index ? "active-color" : "color"}
                  onClick={() =>
                    handleAttributeChange("colorIndex", index, setColorIndex)
                  }
                ></div>
              ))}
            </div>
          </div>
        )}

        {productCapacityAttribute && (
          <div data-testid="product-attribute-capacity">
            <h4 className="prod-info-header">Capacity:</h4>
            <div className="item-sizes">
              {productCapacityAttribute?.items.map((item, index) => (
                <h5
                  className={
                    capacityIndex == index
                      ? "capacity capacity-active"
                      : "capacity"
                  }
                  key={index}
                  onClick={() =>
                    handleAttributeChange(
                      "capacityIndex",
                      index,
                      setCapacityIndex
                    )
                  }
                >
                  {item.value}
                </h5>
              ))}
            </div>
          </div>
        )}

        {productUSB3Attribute && (
          <div data-testid="product-attribute-with-usb-3-ports">
            <h4 className="prod-info-header">With USB 3 ports:</h4>
            <div className="item-sizes">
              {productUSB3Attribute?.items.map((item, index) => (
                <h5
                  className={
                    usbIndex == index ? "capacity capacity-active" : "capacity"
                  }
                  key={index}
                  onClick={() =>
                    handleAttributeChange("usbIndex", index, setUsbIndex)
                  }
                >
                  {item.value}
                </h5>
              ))}
            </div>
          </div>
        )}

        {productkeyboardTouchIdAttribute && (
          <div data-testid="product-attribute-touch-id-in-keyboard">
            <h4 className="prod-info-header">Touch ID in keyboard:</h4>
            <div className="item-sizes">
              {productkeyboardTouchIdAttribute?.items.map((item, index) => (
                <h5
                  className={
                    touchIdIndex == index
                      ? "capacity capacity-active"
                      : "capacity"
                  }
                  key={index}
                  onClick={() =>
                    handleAttributeChange(
                      "touchIdIndex",
                      index,
                      setTouchIdIndex
                    )
                  }
                >
                  {item.value}
                </h5>
              ))}
            </div>
          </div>
        )}

        <h4 className="prod-info-header">Price:</h4>
        <h3 className="prod-price">
          {product?.prices[0].currency_symbol}
          {product?.prices[0].amount}
        </h3>

        <button
          className={
            !areOptionsSelected || !product?.in_stock
              ? "disabled-place-order-btn-detail"
              : "place-order-btn-detail"
          }
          data-testid="add-to-cart"
          style={{
            width: "100%",
          }}
          onClick={handleClickAddToCart}
          disabled={!areOptionsSelected || !product?.in_stock}
        >
          add to cart
        </button>

        <div className="prod-info-desc" data-testid="product-description">
          {productDescription}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
