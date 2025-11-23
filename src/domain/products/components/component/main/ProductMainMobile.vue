<template>
  <div class="product-main-mobile">
    <div class="gallery-section">
      <ProductGallery :images="product?.images || []" />
    </div>
    <div class="details-section">
      <ProductDescriptionMobile :product="product" />
    </div>
    <div class="related-section">
      <ProductRelated :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductGallery from '../gallery/ProductGallery.vue'
import ProductDescriptionMobile from '../description/ProductDescriptionMobile.vue'
import ProductRelated from '../related/ProductRelated.vue'
import type { ProductInterface } from '@/domain/products/interfaces'

defineProps<{
  product: ProductInterface | null
}>()
</script>

<style scoped>
.product-main-mobile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  padding: 0.5rem 0;
  box-sizing: border-box;
}

.gallery-section {
  width: 100%;
}

.details-section {
  width: 100%;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  align-items: center;
}

.related-section {
  width: 100%;
  margin-top: 1.5rem;
}

.reviews-section {
  width: 100%;
  margin-top: 0.5rem;
}

/* Tablet vertical: más espacio */
@media (min-width: 600px) and (max-width: 1023px) {
  .product-main-mobile {
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .related-section,
  .reviews-section {
    margin-top: 1rem;
  }
}
</style>
