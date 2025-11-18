import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSearchStore = defineStore('searchStore', () => {
  // Estado interno (privado)
  const _searchTerm = ref<string>('');

  // Getters (computed)
  const searchTerm = computed(() => _searchTerm.value);

  // Actions
  const setSearchTerm = (term: string) => {
    _searchTerm.value = term;
  }

  const clearSearch = () => {
    _searchTerm.value = '';
  }

  return {
    // Getters (readonly computed)
    searchTerm,
    // Actions
    setSearchTerm,
    clearSearch,
  };
});
