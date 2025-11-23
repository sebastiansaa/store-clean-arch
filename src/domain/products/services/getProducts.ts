// Obtener los productos desde la API filtrados por categoría

import { productsApi } from "../api/productsApi";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import type { AxiosResponse } from "axios";

// Definimos la interfaz que debe cumplir cualquier repositorio que pasemos
export interface ProductRepository {
  getAll(categoryId?: number): Promise<AxiosResponse<ProductInterface[]>>;
}

export const getProducts = async (
  categoryId?: number,
  repository: ProductRepository = productsApi // Inyección de dependencia con valor por defecto
): Promise<ProductInterface[]> => {
  try {
    const response = await repository.getAll(categoryId);
    return response.data;
  } catch (error) {
    logger.error("Error fetching products:", error as Error);
    throw error;
  }
}
