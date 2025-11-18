/** Composable que orquesta toda la lógica del SearchBar.
 * Encapsula: búsqueda, buffering, dropdown visibility, navegación, click outside, etc. */

import { ref, computed, onBeforeUnmount, type Ref } from 'vue'
import { useSearch } from './useSearch'
import { useProductNavigation } from '../../products/products/composables'
import type { ProductInterface } from '../../products/products/interfaces'
import {
  useClickOutside,
  useBufferedInput,
  useDropdownNavigation,
} from '../../../shared/composables'
import { SEARCH_CONFIG } from '../config/search.config'

export function useSearchBar() {
  // ===== State =====
  const containerRef = ref<HTMLElement | null>(null)
  const showDropdown = ref(false)

  // ===== Data Fetching & Search Logic =====
  const {
    searchTerm: searchTermRef,
    setSearchTerm,
    clearSearch,
    results,
    isLoading,
    isError,
    error,
    retry,
  } = useSearch({ debounceMs: 0 }) // sin debounce aquí, delegado a useBufferedInput

  // ===== Navigation =====
  const { navigateToProduct } = useProductNavigation()

  // ===== Buffered Input (debounce + IME) =====
  const buffered = useBufferedInput(searchTermRef, {
    debounceMs: SEARCH_CONFIG.DEBOUNCE_MS,
    onFlush: setSearchTerm,
    onClear: clearSearch,
  })

  // ===== Click Outside Detection =====
  const clickOutside = useClickOutside(
    containerRef,
    () => {
      showDropdown.value = false
    },
    { listenToEscape: true },
  )

  // ===== Keyboard Navigation =====
  const dropdownNav = useDropdownNavigation(
    results,
    (item: ProductInterface) => {
      handleProductSelection(item)
    },
    { isOpen: showDropdown },
  )

  // ===== Computed Properties =====
  const activeDescendant = computed(() => {
    const idx = dropdownNav.activeIndex?.value ?? -1
    return idx >= 0 ? `search-item-${idx}` : undefined
  })

  const activeIndex = computed(() => dropdownNav.activeIndex?.value ?? -1)

  // ===== Event Handlers =====
  const handleFocus = (): void => {
    showDropdown.value = true
  }

  const handleBlur = (): void => {
    buffered.flush()
  }

  const handleSubmit = (): void => {
    buffered.flush()
    showDropdown.value = true
  }

  const handleClear = (): void => {
    buffered.clear()
  }

  const handleProductSelection = (product: ProductInterface): void => {
    navigateToProduct(product)
    showDropdown.value = false
    clearSearch()
    buffered.clear()
  }

  const handleHover = (index: number): void => {
    dropdownNav.setActive(index)
  }

  // Lifecycle
  onBeforeUnmount(() => {
    clickOutside.stop()
    buffered.stop()
    // dropdownNav se limpia internamente
  })

  //  Public API
  return {
    // Refs
    containerRef,
    showDropdown,

    // Input state
    localQuery: buffered.localValue,
    isComposing: buffered.isComposing,

    // Search state
    results,
    isLoading,
    isError,
    error,
    retry,

    // Navigation state
    activeDescendant,
    activeIndex,

    // Event handlers
    handleFocus,
    handleBlur,
    handleSubmit,
    handleClear,
    handleProductSelection,
    handleHover,
    onCompositionStart: buffered.onCompositionStart,
    onCompositionEnd: buffered.onCompositionEnd,
  }
}
