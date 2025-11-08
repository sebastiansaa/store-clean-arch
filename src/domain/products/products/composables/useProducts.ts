//componsable encargado de obtener los productos por categoría

import { useQuery } from "@tanstack/vue-query"
import type { ProductInterface } from "../interfaces"
import { getProducts } from "../services/getProducts"
import { PRODUCTS_CONFIG } from "../../config/products.config"
import { unref } from 'vue'
import type { Ref } from 'vue'

export function useProducts(categoryId: Ref<number> | number) {
  return useQuery<ProductInterface[]>({
    queryKey: ['products', categoryId],
    queryFn: () => getProducts(unref(categoryId)),
    staleTime: PRODUCTS_CONFIG.cache.staleTime,
    gcTime: PRODUCTS_CONFIG.cache.gcTime,
    retry: PRODUCTS_CONFIG.cache.retry,
  })
}

