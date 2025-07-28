import React, { useEffect, useState } from "react";
import "./Details.scss";
import { Slider, ProductInfo } from "../../components";
import type { Product } from "../../graphql/types/product.types";
import { fetchProduct } from "../../services/productService";
import { useParams } from "react-router-dom";

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  const handleCartUpdate = () => {
    console.log("Product added to cart.");

    setProduct(null);
    setTimeout(() => {
      if (id) {
        fetchProduct(id).then(setProduct).catch(console.error);
      }
    }, 0);
  };

  const images = product && product.gallery ? product.gallery : [];

  useEffect(() => {
    if (id && id.length > 0) {
      fetchProduct(id).then(setProduct).catch(console.error);
    }
  }, []);

  return (
    <>
      {product && (
        <div
          className="details-container"
          data-testid={`product-${product.name
            .replace(/\s+/g, "-")
            .toLowerCase()}`}
        >
          <>
            <Slider images={images} />
            <ProductInfo product={product} onCartUpdate={handleCartUpdate} />
          </>
        </div>
      )}
    </>
  );
};

export default Details;
