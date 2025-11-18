import { cartStore } from '@/domain/cart/stores/cartStore'
import type { CartItem } from '@/domain/cart/interface'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
/**
 * Composable que gestiona la navegación hacia el flujo de pago.
 * Sincroniza el `productId` desde la ruta o desde un valor inicial,
 * y verifica si el carrito contiene productos antes de permitir continuar.
 */
export const usePaymentNavigation = (initialProductId?: number) => {
  const router = useRouter()
  const route = useRoute()
  const store = cartStore()

  const items = computed<CartItem[]>(() => store.cartItems)

  const productId = ref<number | null>(
    initialProductId ?? (route.query.productId ? Number(route.query.productId) : null)
  )

  // Sincroniza `productId` si cambia el query param en la ruta (conversión segura a número)
  watch(
    () => route.query.productId,
    (v) => {
      const n = v ? Number(v) : NaN
      productId.value = !isNaN(n) ? n : null
    }
  )

  const canBeginPayment = computed(() => items.value.length > 0)

  const productIdString = computed(() => (productId.value !== null && productId.value !== undefined ? String(productId.value) : ''))

  /**
   * Actualiza manualmente el ID del producto seleccionado.
   * Si el valor proporcionado no es un número válido, se establece como null.
   * @param id - ID del producto a establecer, puede ser number, null o undefined
   */
  const setProductId = (id?: number | null) => {
    productId.value = typeof id === 'number' ? id : null
  }

  /**
   * Navega al checkout si hay productos en el carrito.
   * Incluye `productId` en la query solo si corresponde a un ítem válido.
   * Permite opcionalmente definir una ruta de retorno (`returnTo`).
   * @param opts - Opciones de navegación
   * @param opts.returnTo - Ruta opcional a la que volver después del checkout
   */
  const goToCheckout = (opts?: { returnTo?: string }) => {
    if (!canBeginPayment.value) return
    const query: Record<string, string> = {}

    if (productId.value !== null) {
      // Validación ligera: sólo incluir productId si existe en el carrito
      const exists = store.cartItems.some((it) => it.product?.id === productId.value)
      if (exists) {
        query.productId = String(productId.value)
      } else {
        // Omitimos productId si no corresponde a un ítem del carrito
        console.warn(`goToCheckout: productId ${productId.value} not found in cart; omitting from query.`)
      }
    }

    if (opts?.returnTo) query.returnTo = opts.returnTo
    router.push({ path: '/checkout', query })
  }

  return {
    items,           // Productos actuales en el carrito (reactivo)
    productId,       // ID del producto seleccionado (reactivo y editable)
    productIdString, // Versión string del ID, útil para props o queries
    setProductId,    // Actualiza manualmente el ID del producto seleccionado
    canBeginPayment, // Booleano reactivo: true si el carrito tiene productos
    goToCheckout     // Navega a /checkout con parámetros opcionales (productId, returnTo)
  }
}




