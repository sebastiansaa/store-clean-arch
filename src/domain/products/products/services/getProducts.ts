// Obtener los productos desde la API filtrados por categoría

import { productsApi } from "../api/productsApi";
import type { ProductInterface } from "../interfaces";

export const getProducts = async (categoryId?: number): Promise<ProductInterface[]> => {
  try {
    const response = await productsApi.getAll(categoryId);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
