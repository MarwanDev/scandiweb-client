import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Home, Details } from "../../pages";
import "./Layout.scss";
import type { Category } from "../../graphql/types/category.types";
import { fetchAllCategories } from "../../services/categoryService";

const Layout = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchAllCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <>
      {categories ? (
        <div>
          <Navbar categories={categories} />
          <div className="layout-container">
            <Routes>
              {categories?.map((item) => (
                <Route path={`/${item.name}`} element={<Home category={item} />} />
              ))}
              <Route path="/" element={<Home category={categories[0]} />} />
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
