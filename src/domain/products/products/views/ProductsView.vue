<template>
  <div>
    <Productsgrid :products="products || []" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Productsgrid from '../components/Productsgrid.vue'
import { useProducts } from '../composables/useProducts'
import { useNavStore } from '@/stores'

const route = useRoute()

//categoryId , ahora es reactiva
const categoryId = computed(() => Number(route.params.categoryId))
const { data: products } = useProducts(categoryId)

const navStore = useNavStore()
watch(
  categoryId,
  (newCategoryId) => {
    navStore.setCategory(newCategoryId)
  },
  { immediate: true },
)
</script>

<style scoped></style>
