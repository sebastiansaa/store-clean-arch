<template>
  <div class="product-detail">
    <ProductMain v-if="product" :product="product" />
    <Skeleton v-else-if="isLoading" height="400px" />
    <div v-else-if="error">Error al cargar producto</div>
  </div>
</template>

<script setup lang="ts">
import ProductMain from '../components/component/main/ProductMain.vue'
import { useRoute } from 'vue-router'
import { useProductById } from '../composables/useProductById'
import { computed } from 'vue'
import { Skeleton } from '@/shared/components/layout'

const route = useRoute()

//  id reactivo para que cambie cuando cambia la ruta
const id = computed(() => Number(route.params.id))
const { data: product, isLoading, error } = useProductById(id)
</script>

<style scoped></style>
