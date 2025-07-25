import client from '../graphql/client';
import { GET_ALL_PRODUCTS, PRODUCTS_BY_CATEGORY, PRODUCT } from '../graphql/queries/products';
import type { Product } from '../graphql/types/product.types';

export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const data = await client.request<{ products: Product[] }>(GET_ALL_PRODUCTS);
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchProductsByCategory(categoryId: number): Promise<Product[]> {
  try {
    const data = await client.request<{ productsByCategory: Product[] }>(
      PRODUCTS_BY_CATEGORY,
      { categoryId }
    );
    return data.productsByCategory;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  try {
    const data = await client.request<{ product: Product }>(PRODUCT, { id });
    return data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}
