// Obtener las categorías desde la API, filtrarlas y exponerlas reactivamente para que el nav

import { ref, onMounted, computed } from 'vue'
import { categoriesApi } from '../api/categoriesApi'
import type { CategoryInterface } from '../interfaces'

const MAIN_CATEGORY_SLUGS = ['clothes', 'electronics', 'furniture', 'shoes', 'miscellaneous']

export function useCategories() {
  const categories = ref<CategoryInterface[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await categoriesApi.getAll()
      categories.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar categorías'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCategories)

  const filteredCategories = computed(() =>
    categories.value.filter(cat => MAIN_CATEGORY_SLUGS.includes(cat.name.toLowerCase()))
  )

  return { categories: filteredCategories, fetchCategories, error }
}
