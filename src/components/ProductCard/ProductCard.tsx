import React, { useState, useEffect, useCallback } from "react";
import "./ProductCard.scss";
import { Link, useLocation } from "react-router-dom";
import cart from "../../assets/Empty Cart.svg";
import type { OrderProduct, Product } from "../../graphql/types/product.types";

interface ProductCardProps {
  product: Product;
  onCartUpdate?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCartUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [route, setRoute] = useState("");
  const location = useLocation();

  const getRouteFromURL = useCallback(() => {
    const parts = location.pathname.split("/");
    const lastSegment = parts[parts.length - 1];
    setRoute(lastSegment);
  }, [location.pathname]);

  useEffect(() => {
    const stored = localStorage.getItem("orderProducts");
    if (stored) {
      setOrderProducts(JSON.parse(stored));
      console.log(orderProducts);
    }
    getRouteFromURL();
  }, [getRouteFromURL]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const normalizeKey = (name: string) =>
    name.replace(/\s+/g, "-").toLowerCase();

  const handleClickQuickShop = () => {
    const stored = localStorage.getItem("orderProducts");
    const updatedOrderProducts: OrderProduct[] = stored ? JSON.parse(stored) : [];

    const defaultAttributes: Record<string, number> = {};

    product.attributes?.forEach((attr) => {
      const key = normalizeKey(attr.name);
      defaultAttributes[key] = 0;
    });

    const existingIndex = updatedOrderProducts.findIndex(
      (item) =>
        item.productDetails?.id === product.id &&
        Object.entries(defaultAttributes).every(
          ([key, value]) => item.attributes?.[key] === value
        )
    );

    if (existingIndex !== -1) {
      updatedOrderProducts[existingIndex].quantity += 1;
    } else {
      updatedOrderProducts.push({
        productDetails: { ...product },
        attributes: defaultAttributes,
        quantity: 1,
      });
    }

    setOrderProducts(updatedOrderProducts);
    localStorage.setItem("orderProducts", JSON.stringify(updatedOrderProducts));
    window.dispatchEvent(new Event("orderProductsUpdated"));

    onCartUpdate?.();
  };

  return (
    <Link
      className="card-container"
      to={`/details/${product.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`product-${product.name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <img
        src={product.gallery[0].image_url}
        alt={product.name}
        className="prod-img"
        loading="lazy"
      />

      {product.in_stock && isHovered && (
        <Link to={`/${route}`}>
          <img
            src={cart}
            alt="quick-shop"
            className="quick-shop"
            onClick={(e) => {
              e.preventDefault();
              handleClickQuickShop();
            }}
          />
        </Link>
      )}

      <div className="prod-details">
        <p className="prod-card-name">{product.name}</p>
        <p
          className="prod-card-price"
          style={{ color: product.in_stock ? "#000" : "#8D8F9A" }}
        >
          {product.prices[0].currency_symbol}
          {product.prices[0].amount}
        </p>
      </div>

      {!product.in_stock && (
        <div className="overlay">
          <h3 className="prod-state">Out of Stock</h3>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
