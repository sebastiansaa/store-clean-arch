<template>
  <div class="product-gallery">
    <ProductGalleryDesktop v-if="isReady && isDesktop" :images="images" />
    <ProductGalleryMobile v-else-if="isReady && !isDesktop" :images="images" />
    <Skeleton v-else height="160px" />
  </div>
</template>

<script setup lang="ts">
import ProductGalleryDesktop from './ProductGalleryDesktop.vue'
import ProductGalleryMobile from './ProductGalleryMobile.vue'
import { useBreakPoints } from '@/shared/composables'
import { Skeleton } from '@/shared/components/layout'

defineProps<{
  images: string[]
}>()

const { isDesktop, isReady } = useBreakPoints()
</script>

<style scoped>
.product-gallery {
  width: 100%;
}
</style>
