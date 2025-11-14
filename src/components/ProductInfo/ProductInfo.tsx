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
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, number>
  >({});
  const [isProductInCart, setIsProductInCart] = useState<boolean>(false);
  const productTextTypeAttributes =
    product?.attributes?.filter((attr) => attr?.type === "text") ?? [];
  const productSwatchTypeAttributes =
    product?.attributes?.filter((attr) => attr?.type === "swatch") ?? [];

  useEffect(() => {
    const storedProducts = localStorage.getItem("orderProducts");
    if (storedProducts) {
      setOrderProducts(JSON.parse(storedProducts));
    }
  }, []);

  useEffect(() => {
    const isInCart = orderProducts?.some(
      (item: OrderProduct) =>
        item.id === product.id && product.attributes.length == 0
    );
    setIsProductInCart(!!isInCart);
    console.log(isProductInCart);
  }, [orderProducts, product.id]);

  const normalizeKey = (name: string) => name.toLowerCase().replace(/ /g, "-");

  const handleClickAddToCart = () => {
    const updatedOrderProducts = [...orderProducts];

    const existingIndex = updatedOrderProducts.findIndex(
      (item) =>
        item?.productDetails?.id === product.id &&
        Object.entries(selectedAttributes).every(
          ([key, value]) => item.attributes[key] === value
        )
    );

    if (existingIndex !== -1) {
      updatedOrderProducts[existingIndex].quantity++;
    } else {
      updatedOrderProducts.push({
        productDetails: { ...product },
        attributes: { ...selectedAttributes },
        quantity: 1,
      });
    }

    setOrderProducts(updatedOrderProducts);
    localStorage.setItem("orderProducts", JSON.stringify(updatedOrderProducts));
    window.dispatchEvent(new Event("orderProductsUpdated"));
    onCartUpdate?.();
  };

  const productDescription = parse(
    product?.description.replace(/\\n/g, "") || ""
  );

  const handleAttributeChange = (attributeName: string, index: number) => {
    const key = normalizeKey(attributeName);

    const newSelected = {
      ...selectedAttributes,
      [key]: index,
    };

    setSelectedAttributes(newSelected);
    console.log(selectedAttributes);

    const match = orderProducts.some(
      (item) =>
        item.productDetails?.id === product.id &&
        Object.entries(newSelected).every(
          ([k, v]) => item.attributes?.[k] === v
        )
    );

    setIsProductInCart(match);
  };

  const areOptionsSelected = product?.attributes?.every((attr) =>
    Object.prototype.hasOwnProperty.call(
      selectedAttributes,
      normalizeKey(attr.name)
    )
  );

  return (
    <div className="prod-info-container">
      <div className="item-info">
        <h4 className="prod-name">{product?.name}</h4>

        {productSwatchTypeAttributes.map((attr) => {
          const key = normalizeKey(attr.name);

          return (
            <div key={attr.name} data-testid={`product-attribute-${key}`}>
              <h4 className="prod-info-header">{attr.name}:</h4>
              <div className="item-colors">
                {attr.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      height: 24,
                      width: 24,
                      backgroundColor: item.value,
                    }}
                    className={
                      selectedAttributes[key] === index
                        ? "active-color"
                        : "color"
                    }
                    data-testid={`product-attribute-${key}-${item.value}`}
                    onClick={() => handleAttributeChange(attr.name, index)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {productTextTypeAttributes.map((attr) => {
          const key = normalizeKey(attr.name);
          const maxLength = Math.max(...attr.items.map((i) => i.value.length));
          const baseClass = maxLength >= 3 ? "capacity" : "size";

          return (
            <div key={attr.name} data-testid={`product-attribute-${key}`}>
              <h4 className="prod-info-header">{attr.name}:</h4>

              <div className="item-sizes">
                {attr.items.map((item, index) => (
                  <h5
                    key={index}
                    className={
                      selectedAttributes[key] === index
                        ? `${baseClass} ${baseClass}-active`
                        : baseClass
                    }
                    data-testid={`product-attribute-${key}-${item.value}`}
                    onClick={() => handleAttributeChange(attr.name, index)}
                  >
                    {item.value}
                  </h5>
                ))}
              </div>
            </div>
          );
        })}

        <h4 className="prod-info-header">Price:</h4>
        <h3 className="prod-price">
          {product?.prices[0].currency_symbol}
          {product?.prices[0].amount}
        </h3>

        {product?.in_stock && (
          <button
            className={
              !areOptionsSelected
                ? "disabled-place-order-btn-detail"
                : "place-order-btn-detail"
            }
            data-testid="add-to-cart"
            style={{ width: "100%" }}
            onClick={handleClickAddToCart}
            disabled={!areOptionsSelected}
          >
            add to cart
          </button>
        )}

        <div className="prod-info-desc" data-testid="product-description">
          {productDescription}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
