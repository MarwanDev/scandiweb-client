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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    if (category && category?.name == "all") {
      fetchAllProducts()
        .then((data) => setProducts(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      fetchProductsByCategory(category?.id)
        .then((data) => setProducts(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [category]);

  if (loading) {
    return <p data-testid="loading">Loading products...</p>;
  }

  if (!products || products.length === 0) {
    return <p data-testid="no-products">No products found</p>;
  }

  return (
    <div className="home-container">
      <h1 className="home-heading">{category?.name}</h1>
      <div className="results">
        {products && products.length > 0 ? (
          products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
