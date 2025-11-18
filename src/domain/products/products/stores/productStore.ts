import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ProductInterface } from "../interfaces";

export const useProductStore = defineStore('productStores', () => {

  // Estado interno (privado)
  const _productsList = ref<ProductInterface[]>([]);
  const _selectedProductDTO = ref<ProductInterface | null>(null);
  const _selectedProductId = ref<number | null>(null);

  // Getters (computed)
  const productsList = computed(() => _productsList.value);
  const selectedProductDTO = computed(() => _selectedProductDTO.value);
  const selectedProductId = computed(() => _selectedProductId.value);

  // Actions
  const setProductsList = (products: ProductInterface[]) => {
    _productsList.value = products;
  };

  const selectProduct = (product: ProductInterface) => {
    _selectedProductId.value = product.id;
    _selectedProductDTO.value = product;
  };

  const selectProductById = (id: number) => {
    _selectedProductId.value = id;
    _selectedProductDTO.value = null;
  };

  return {
    // Getters (readonly computed)
    productsList,
    selectedProductDTO,
    selectedProductId,
    // Actions
    setProductsList,
    selectProduct,
    selectProductById,
  };
});
