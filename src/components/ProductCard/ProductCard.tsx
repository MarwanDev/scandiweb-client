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

  const handleClickQuickShop = () => {
    const stored = localStorage.getItem("orderProducts");
    let updatedOrderProducts: OrderProduct[] = [];
    if (stored) {
      updatedOrderProducts = JSON.parse(stored);
    }

    const existingIndex = updatedOrderProducts.findIndex(
      (item: OrderProduct) =>
        item.productDetails?.id == product.id &&
        item.colorIndex == 0 &&
        item.sizeIndex == 0 &&
        item.capacityIndex == 0 &&
        item.usbIndex == 0 &&
        item.touchIdIndex == 0
    );
    if (existingIndex !== -1) {
      updatedOrderProducts[existingIndex].quantity =
        (updatedOrderProducts[existingIndex].quantity || 1) + 1;
    } else {
      const updatedProduct: OrderProduct = {
        productDetails: { ...product },
        colorIndex: 0,
        sizeIndex: 0,
        capacityIndex: 0,
        usbIndex: 0,
        touchIdIndex: 0,
        quantity: 1,
      };
      updatedOrderProducts.push(updatedProduct);
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
      data-testid={`product-${product.name}`}
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
            loading="lazy"
            onClick={handleClickQuickShop}
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
