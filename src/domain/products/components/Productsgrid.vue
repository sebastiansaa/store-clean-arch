<template>
  <GridComponent class="product-grid">
    <Productscard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @select="navigateToProduct"
    />
  </GridComponent>
</template>

<script setup lang="ts">
import GridComponent from '@/shared/components/layout/GridComponent.vue'
import Productscard from './Productscard.vue'
import { useProductNavigation } from '../composables'
import type { ProductInterface } from '../interfaces'

defineProps<{
  products: ProductInterface[]
}>()

const { navigateToProduct } = useProductNavigation()
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: 100%;
}

@media (max-width: 1023px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 767px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
