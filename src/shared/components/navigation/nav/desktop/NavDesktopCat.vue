<template>
  <div class="nav-desktop-cat">
    <BaseAccountButton
      v-for="cat in categories"
      :key="cat.key"
      class="base-btn-nav-desktop-cat"
      :class="{ active: cat.key === selectedCategory }"
      @click="selectCategory(cat.key)"
    >
      {{ cat.label }}
    </BaseAccountButton>
  </div>
</template>

<script setup lang="ts">
import { BaseAccountButton } from '@/shared/components/ui/actions/buttons'
import { useNavigation } from '@/shared/composables/useNavigation'
import { categories } from '@/shared/helpers/categories'

const emit = defineEmits(['select'])
const { handleCategory, navStore } = useNavigation()
const selectedCategory = navStore.selectedCategory

//select category and emit event
function selectCategory(key: string) {
  handleCategory(key)
  // El siguiente emit es opcional: solo es necesario si el padre necesita reaccionar al cambio de categoría.
  // Si no se usa en el padre, se puede eliminar para simplificar el componente.
  emit('select', key)
}
</script>

<style scoped>
.nav-desktop-cat {
  display: none;
}

@media (min-width: 768px) {
  .nav-desktop-cat {
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    background: #e0dacf;
    border-bottom: 1px solid #e0e7ef;
    border-radius: 18px;
    width: 100%;
    max-width: 1280px;
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    top: calc(62px + 0.5rem);
    z-index: 1999;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    margin: 0;
  }
}
.base-btn-nav-desktop-cat {
  font-size: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  background: #e0dacf;
  color: #222;
  border: none;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.base-btn-nav-desktop-cat:hover,
.base-btn-nav-desktop-cat.active {
  background: #ececec;
  color: #181818;
}
</style>
