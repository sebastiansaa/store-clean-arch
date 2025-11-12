// store para busqueda global de productos por título
// con debounce y min de char para realizar la búsqueda

import { useSearchStore } from "../stores/searchStore"
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref, unref, watch, type Ref } from "vue";
import { getProducts } from "../../products/products/services/getProducts";
import type { ProductInterface } from "../../products/products/interfaces";
import { SEARCH_CONFIG } from "../config/search.config";

//"{ debounceMs }" => el retardo antes de lanzar búsqueda
// minChars puede ser un number o un Ref<number> para permitir reactividad desde fuera
export const useSearch = ({
  debounceMs = SEARCH_CONFIG.DEBOUNCE_MS as number,
  minChars = SEARCH_CONFIG.MIN_CHARS as number | Ref<number>
} = {}) => {

  const searchStore = useSearchStore() // Estado global
  const queryClient = useQueryClient()

  // debouncedTerm evita lanzar la query en cada pulsación
  const debouncedTerm = ref(unref(searchStore.searchTerm))
  let timer: ReturnType<typeof setTimeout> | null = null

  // Actualiza debouncedTerm con retardo.
  watch(() => searchStore.searchTerm, (val) => {
    const term = unref(val)
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedTerm.value = term
    }, debounceMs)
  })

  // Usa la misma queryKey que el prefetch en App.vue
  const {
    data: allProducts,
    isLoading: queryLoading,
    isError: queryIsError,
    error: queryError,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: SEARCH_CONFIG.QUERY_STALE_TIME,
  })

  // Filtra localmente sin hacer nuevas requests. CaseInsensitive
  const results = computed(() => {
    const term = debouncedTerm.value?.toLowerCase().trim()
    // Si no hay término, o el término no llega al mínimo de caracteres, o no hay productos, devolver vacío
    if (!term || term.length < unref(minChars) || !allProducts.value) {
      return []
    }
    return allProducts.value.filter((product: ProductInterface) =>
      product.title.toLowerCase().includes(term)
    )
  })

  // isLoading defensivo: usa optional chaining y el parámetro minChars
  // isLoading: combinar el estado de la query con el umbral de minChars
  const isLoading = computed(() => (queryLoading.value ?? false) && (debouncedTerm.value?.length ?? 0) > unref(minChars))

  // Exponer estado de error y una función de reintento (refetch)
  const isError = computed(() => !!queryIsError.value)
  const error = queryError
  const retry = queryRefetch

  return {
    results,
    isLoading,
    isError,
    error,
    retry,
    searchTerm: searchStore.searchTerm,
    setSearchTerm: searchStore.setSearchTerm,
    clearSearch: searchStore.clearSearch
  }
}
