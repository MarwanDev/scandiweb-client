import React, { useEffect, useState, useRef } from "react";
import "./Navbar.scss";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import cart from "../../assets/cart.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import Cart from "../Cart/Cart";
import type { Category } from "../../graphql/types/category.types";
import type { OrderProduct } from "../../graphql/types/product.types";

interface NavbarProps {
  categories: Category[];
}

const Navbar: React.FC<NavbarProps> = ({ categories }) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [cartToggle, setCartToggle] = useState<boolean>(false);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const cartClickHandler = () => {
    setCartToggle((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
      setCartToggle(false);
    }
  };

  useEffect(() => {
    const storedProducts = localStorage.getItem("orderProducts");
    if (storedProducts) {
      setOrderProducts(JSON.parse(storedProducts));
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const syncOrderProducts = () => {
      const storedProducts = localStorage.getItem("orderProducts");
      if (storedProducts) {
        setOrderProducts(JSON.parse(storedProducts));
      } else {
        setOrderProducts([]);
      }
    };

    // Listen to both custom and native storage events
    window.addEventListener("storage", syncOrderProducts);
    window.addEventListener("orderProductsUpdated", syncOrderProducts);

    // Initial load
    syncOrderProducts();

    return () => {
      window.removeEventListener("storage", syncOrderProducts);
      window.removeEventListener("orderProductsUpdated", syncOrderProducts);
    };
  }, []);

  return (
    <nav className="app__navbar">
      <GiHamburgerMenu
        style={{ fontSize: 25 }}
        onClick={() => setToggle(!toggle)}
        className="menu-burger"
      />
      <div className="app__navbar-menu">
        {toggle && (
          <motion.div
            whileInView={{ x: [-300, 0] }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <HiX onClick={() => setToggle(false)} />
            <ul>
              {categories?.map((item) => {
                const path = `/${item.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .trim()}`;
                const isRoot = location.pathname === "/" && item.id == 1;

                return (
                  <li key={item.id}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        isActive || isRoot ? "active nav-link" : "nav-link"
                      }
                      data-testid={
                        location.pathname === path || isRoot
                          ? "active-category-link"
                          : "category-link"
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </div>

      <ul className="app__navbar-links">
        {categories?.map((item) => {
          const path = `/${item.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .trim()}`;
          const isRoot = location.pathname === "/" && item.id == 1;

          return (
            <li key={item.id}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive || isRoot ? "active nav-link" : "nav-link"
                }
                data-testid={
                  location.pathname === path || isRoot
                    ? "active-category-link"
                    : "category-link"
                }
              >
                {item.name}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <NavLink to="/">
        <img src={logo} alt="logo" />
      </NavLink>

      <div className="app__navbar-menu" />

      <button
        onClick={cartClickHandler}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          border: "none",
          cursor: "pointer",
          position: "relative",
        }}
        data-testid="cart-btn"
      >
        {orderProducts.length > 0 && (
          <div
            style={{
              color: "#fff",
              backgroundColor: "#1D1F22",
              borderRadius: "50%",
              padding: "5px 10px 4px 10px",
              fontSize: 14,
              right: -12,
              width: 15,
              textAlign: "center",
              bottom: "45%",
              zIndex: 2,
              position: "absolute",
              display: "flex",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontFamily: `"Roboto", sans-serif` }}>
              {orderProducts.length < 9 ? orderProducts.length : "9+"}
            </p>
          </div>
        )}
        <img src={cart} alt="cart" />
      </button>

      {cartToggle && (
        <div className="cart-backdrop" onClick={() => setCartToggle(false)}>
          <div
            className="cart-popup"
            ref={cartRef}
            onClick={(e) => e.stopPropagation()}
          >
            <Cart orderProducts={orderProducts} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
