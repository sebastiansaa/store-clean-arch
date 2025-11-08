import { productsApi } from "../api/productsApi";
import type { ProductInterface } from "../interfaces";

export const getProducts = async (): Promise<ProductInterface[]> => {
  try {
    const response = await productsApi.getAll();
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
