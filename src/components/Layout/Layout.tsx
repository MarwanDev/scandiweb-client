import { Route, Routes } from "react-router-dom";
// import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Home, Details } from "../../pages";
import { useState, useEffect } from "react";
import type { Product } from "../../graphql/types/product.types";
import "./Layout.scss";
import type { Category } from "../../graphql/types/category.types";
import { fetchAllProducts } from "../../services/productService";
// import { fetchAllCategories } from "../../services/categoryService";

const Layout = ({ initialCategories }: { initialCategories: Category[] }) => {
  // useEffect(() => {
  //   if (!initialCategories) {
  //     fetchAllCategories().then(setCategories).catch(console.error);
  //   }
  // }, []);
  // const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetchAllProducts()
        .then((data) => setProducts(data))
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {initialCategories && products && !loading ? (
        <div>
          <Navbar categories={initialCategories} />
          <div className="layout-container">
            <Routes>
              {initialCategories?.map((item) => (
                <Route
                  path={`/${item.name}`}
                  element={<Home category={item} categoryProducts={products} />}
                />
              ))}
              <Route
                path="/"
                element={<Home category={initialCategories[0]} categoryProducts={products} />}
              />
              <Route path="/details/:id" element={<Details />} />
            </Routes>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Layout;
