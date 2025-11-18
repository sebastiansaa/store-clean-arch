import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store Pinia para controlar el estado del mini-cart drawer.
 * Estados posibles: 'closed' | 'mini' | 'expanded'
 */
export const useMiniCartStore = defineStore('miniCart', () => {
  // Estado interno (privado)
  const _state = ref<'closed' | 'mini' | 'expanded'>('closed')

  // Getters (computed)
  const state = computed(() => _state.value)
  const isOpen = computed(() => _state.value !== 'closed')
  const isMini = computed(() => _state.value === 'mini')
  const isExpanded = computed(() => _state.value === 'expanded')

  // Actions
  const openMini = () => {
    _state.value = 'mini'
  }

  const openExpanded = () => {
    _state.value = 'expanded'
  }

  const expand = () => {
    if (_state.value === 'mini') _state.value = 'expanded'
  }

  const close = () => {
    _state.value = 'closed'
  }

  return {
    // Getters
    state,
    isOpen,
    isMini,
    isExpanded,
    // Actions
    openMini,
    openExpanded,
    expand,
    close,
  }
})
