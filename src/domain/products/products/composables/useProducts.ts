import { useQuery } from "@tanstack/vue-query"
import type { ProductInterface } from "../interfaces"
import { getProducts } from "../services/getProducts"
import { PRODUCTS_CONFIG } from "../../config/products.config"

export const useProducts = () => {
  return useQuery<ProductInterface[]>({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: PRODUCTS_CONFIG.cache.staleTime,
    gcTime: PRODUCTS_CONFIG.cache.gcTime,
    retry: PRODUCTS_CONFIG.cache.retry,

  })
}

