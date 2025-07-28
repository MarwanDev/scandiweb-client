import { Route, Routes } from "react-router-dom";
// import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Home, Details } from "../../pages";
import "./Layout.scss";
import type { Category } from "../../graphql/types/category.types";
// import { fetchAllCategories } from "../../services/categoryService";

const Layout = ({ initialCategories }: { initialCategories: Category[] }) => {
  // useEffect(() => {
  //   if (!initialCategories) {
  //     fetchAllCategories().then(setCategories).catch(console.error);
  //   }
  // }, []);
  // const [categories, setCategories] = useState(initialCategories);

  return (
    <>
      {initialCategories ? (
        <div>
          <Navbar categories={initialCategories} />
          <div className="layout-container">
            <Routes>
              {initialCategories?.map((item) => (
                <Route
                  path={`/${item.name}`}
                  element={<Home category={item} />}
                />
              ))}
              {/* <Route path="/" element={<Home category={categories[0]} />} /> */}
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
