import React, { useState, useEffect, useCallback } from "react";
import "./ProductCard.scss";
import { Link, useLocation } from "react-router-dom";
import cart from "../../assets/Empty Cart.svg";
import type { Product } from "../../graphql/types/product.types";

// interface Product {
//   id: string;
//   name: string;
//   inStock: boolean;
//   amount: number;
//   currency_symbol: string;
//   gallery: string;
//   [key: string]: any;
// }

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [orderProducts, setOrderProducts] = useState<Product[]>([]);
  const [route, setRoute] = useState("");
  const location = useLocation();

  // const colorIndex = 0;
  // const sizeIndex = 0;
  // const capacityIndex = 0;
  // const usbIndex = 0;
  // const touchIdIndex = 0;

  const getRouteFromURL = useCallback(() => {
    const parts = location.pathname.split("/");
    const lastSegment = parts[parts.length - 1];
    setRoute(lastSegment);
  }, [location.pathname]);

  useEffect(() => {
    const stored = localStorage.getItem("orderProducts");
    if (stored) {
      setOrderProducts(JSON.parse(stored));
    }
    getRouteFromURL();
  }, [getRouteFromURL]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // const handleClickQuickShop = (e: React.MouseEvent) => {
  //   e.preventDefault(); // prevent navigation

  //   const existingProduct = orderProducts.find(
  //     (item) =>
  //       item.id === product.id &&
  //       item.colorIndex === 0 &&
  //       item.sizeIndex === 0 &&
  //       item.capacityIndex === 0 &&
  //       item.usbIndex === 0 &&
  //       item.touchIdIndex === 0
  //   );

  //   if (!existingProduct) {
  //     const updatedProduct = {
  //       ...product,
  //       colorIndex: 0,
  //       sizeIndex: 0,
  //       capacityIndex: 0,
  //       usbIndex: 0,
  //       touchIdIndex: 0,
  //     };
  //     const updatedOrderProducts = [...orderProducts, updatedProduct];
  //     setOrderProducts(updatedOrderProducts);
  //     localStorage.setItem("orderProducts", JSON.stringify(updatedOrderProducts));
  //     window.location.reload(); // mimic original behavior
  //   } else {
  //     console.warn("Product already exists in cart.");
  //   }
  // };

  return (
    <Link
      className="card-container"
      to={`/details/${product.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`product-${product.name}`}
    >
      <img src={product.gallery[0].image_url} alt={product.name} className="prod-img" loading="lazy" />
      
      {product.in_stock && isHovered && (
        <Link to={`/${route}`}>
          <img
            src={cart}
            alt="quick-shop"
            className="quick-shop"
            loading="lazy"
            // onClick={handleClickQuickShop}
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
