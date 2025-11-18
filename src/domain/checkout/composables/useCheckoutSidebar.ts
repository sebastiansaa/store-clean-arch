import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useCheckoutStore } from '@/domain/checkout/stores/checkoutStore'
import type { CardFormRef } from '@/domain/checkout/composables/useCheckoutFlow'

/**
 * Composable para orquestar el flujo del CheckoutSidebar.
 *
 * Responsabilidades:
 * - Conectar con checkoutStore
 * - Manejar referencia al formulario de tarjeta
 * - Exponer estado reactivo y acciones
 * - Logging de debugging
 *
 * Este composable facilita la separación de lógica del componente CheckoutSidebar,
 * haciéndolo más testeable y mantenible.
 */
export function useCheckoutSidebar() {
  const checkout = useCheckoutStore()
  const { customer, payment, errorMessage, isProcessing, success, canPay } = storeToRefs(checkout)
  const { onCustomerConfirm, onPaymentSelect, onCardTokenized, setCardForm, handlePayment } = checkout

  const cardFormRef = ref<CardFormRef>(null)

  // Mantener el store sincronizado con la referencia del formulario de tarjeta.
  // El formulario puede montarse/desmontarse dinámicamente (v-if según método),
  // por eso observamos la ref y actualizamos el store cuando cambie.
  const stopWatch = watch(
    cardFormRef,
    (val) => {
      setCardForm(val)
      console.log('[CheckoutSidebar] cardFormRef changed - setCardForm called:', !!val)
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    // Asegurarse de quitar referencia al desmontar
    setCardForm(null)
    stopWatch()
  })

  /**
   * Maneja el clic en el botón "Pagar ahora".
   * - Llama a handlePayment del store (que incluye tokenización automática)
   * - Devuelve el payload del checkout si es exitoso
   */
  async function handlePay(total: number) {
    console.log('[CheckoutSidebar] Iniciando pago con total:', total)

    // Si el formulario de tarjeta aún no está montado (cardFormRef -> store.cardForm === null),
    // esperar hasta que esté disponible o hasta que expire el timeout.
    const waitForCardForm = async (timeout = 1500, interval = 50) => {
      const start = Date.now()
      // Accedemos directamente al store.cardForm (no destructurado) para comprobar su valor
      // porque setCardForm actualiza ese valor.
      // Si no hay método de pago 'card' no hace falta esperar.
      if (payment.value?.method !== 'card') return true
      // Si ya está disponible, continuar
      if (checkout.cardForm) return true

      while (Date.now() - start < timeout) {
        if (checkout.cardForm) return true
        await new Promise((resolve) => setTimeout(resolve, interval))
      }
      return false
    }

    const cardReady = await waitForCardForm()
    if (!cardReady) {
      console.warn('[CheckoutSidebar] cardForm no disponible tras timeout; continuará y podría fallar')
    }

    const result = await handlePayment(total)
    if (result) {
      console.log('[CheckoutSidebar] Pago exitoso:', result)
    } else {
      console.error('[CheckoutSidebar] Pago falló')
    }
    return result
  }

  return {
    // Estado reactivo
    customer,
    payment,
    errorMessage,
    isProcessing,
    success,
    canPay,
    cardFormRef,

    // Acciones
    onCustomerConfirm,
    onPaymentSelect,
    onCardTokenized,
    handlePay,
  }
}
