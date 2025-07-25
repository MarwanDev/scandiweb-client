import React, { useState, useEffect } from "react";
import "./Home.scss";
import { ProductCard } from "../../components";
import type { Product } from "../../graphql/types/product.types";
import {
  fetchAllProducts,
  fetchProductsByCategory,
} from "../../services/productService";
import type { Category } from "../../graphql/types/category.types";

interface HomeProps {
  category: Category;
}

const Home: React.FC<HomeProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (category && category?.name == "all")
      fetchAllProducts().then(setProducts).catch(console.error);
    else {
      fetchProductsByCategory(category?.id)
        .then(setProducts)
        .catch(console.error);
    }
  }, [category]);

  return (
    <div className="home-container">
      <h1 className="home-heading">{category?.name}</h1>
      <div className="results">
        {products && products.length > 0 ? (
          products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
