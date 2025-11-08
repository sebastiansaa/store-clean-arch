/* Gestiona el estado global de navegación de la aplicación. Permite:
 * Guardar la categoría seleccionada (selectedCategory) para resaltar la categoría activa en el nav.
 * Controlar la sección actual (currentSection) para navegación interna.
 * Manejar la apertura/cierre del menú de categorías (isNavCatOpen).
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavStore = defineStore('nav', () => {

  const selectedCategory = ref<number>(0)
  const currentSection = ref<string>('')
  const isNavCatOpen = ref<boolean>(false)

  const setCategory = (categoryId: number) => {
    selectedCategory.value = categoryId
  }

  const setCurrentSection = (section: string) => {
    currentSection.value = section
  }

  const toggleNavCat = () => {
    isNavCatOpen.value = !isNavCatOpen.value
  }

  return {
    selectedCategory,
    currentSection,
    isNavCatOpen,

    setCategory,
    setCurrentSection,
    toggleNavCat,
  }

});
