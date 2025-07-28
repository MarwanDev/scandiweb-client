import React, { useEffect, useState } from "react";
import "./Details.scss";
import { Slider, ProductInfo } from "../../components";
import type { Product } from "../../graphql/types/product.types";
import { fetchProduct } from "../../services/productService";
import { useParams } from "react-router-dom";

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleCartUpdate = () => {
    console.log("Product added to cart.");
    setProduct(null);
    setLoading(true);
    setTimeout(() => {
      if (id) {
        fetchProduct(id)
          .then((data) => {
            setProduct(data);
            setError(null);
          })
          .catch((err) => setError(`Failed to reload product ${err}.`))
          .finally(() => setLoading(false));
      }
    }, 0);
  };

  const images = product && product.gallery ? product.gallery : [];

  useEffect(() => {
    if (id && id.length > 0) {
      setLoading(true);
      fetchProduct(id)
        .then((data) => {
          setProduct(data);
          setError(null);
        })
        .catch((err) => setError(`Failed to reload product ${err}.`))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <p data-testid="loading">Loading product...</p>;
  }

  if (error) {
    return <p data-testid="error">{error}</p>;
  }

  if (!product) {
    return <p data-testid="no-product">Product not found</p>;
  }

  return (
    <div
      className="details-container"
      data-testid={`product-${product.name.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <Slider images={images} />
      <ProductInfo product={product} onCartUpdate={handleCartUpdate} />
    </div>
  );
};

export default Details;
