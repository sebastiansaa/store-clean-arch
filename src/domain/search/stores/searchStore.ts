import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore('searchStore', () => {
  const searchTerm = ref<string>('');

  const setSearchTerm = (term: string) => {
    searchTerm.value = term;
  }

  const clearSearch = () => {
    searchTerm.value = '';
  }
  return {
    searchTerm,// término de búsqueda actual
    setSearchTerm,// actualiza el término de búsqueda
    clearSearch,// restablece el término de búsqueda
  };
});
