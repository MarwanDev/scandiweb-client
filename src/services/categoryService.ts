import client from '../graphql/client';
import { GET_ALL_CATEGORIES } from '../graphql/queries/categories';
import type { Category } from '../graphql/types/category.types';

export async function fetchAllCategories(): Promise<Category[]> {
  try {
    const data = await client.request<{ categories: Category[] }>(GET_ALL_CATEGORIES);
    return data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
