import { ref, onMounted, onUnmounted, computed } from 'vue'
import { SHARED_CONFIG } from '../config/shared.config'

/**
 * Composable para manejar breakpoints responsive: mobile, tablet vertical y desktop/PC
 */
export function useBreakPoints() {
  const windowWidth = ref(0)

  function updateDimensions() {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
  })

  // Breakpoints: mobile, tablet vertical, desktop/PC
  const isMobile = computed(() => windowWidth.value <= SHARED_CONFIG.breakpoints.mobile)
  const isTablet = computed(() => windowWidth.value > SHARED_CONFIG.breakpoints.mobile && windowWidth.value <= SHARED_CONFIG.breakpoints.tabletMax)
  const isDesktop = computed(() => windowWidth.value >= SHARED_CONFIG.breakpoints.desktop)

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
  }
}
