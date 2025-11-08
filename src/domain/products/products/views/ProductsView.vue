<template>
  <div>
    <Productsgrid :products="products || []" />
  </div>
</template>

<script setup lang="ts">
import Productsgrid from '../components/Productsgrid.vue'
import { useProducts } from '../composables/useProducts'

const { data: products } = useProducts()
</script>

<style scoped></style>
