import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { performCardPayment, type CardFormRef } from '@/domain/checkout/composables/useCheckoutFlow'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import type { Customer, PaymentMethod, CardPaymentDetails, CompleteCheckoutPayload, PaymentIntent } from '@/domain/checkout/interfaces/types'

export const useCheckoutStore = defineStore('checkout', () => {
  const customer = ref<Customer | null>(null)
  const payment = ref<PaymentMethod | null>(null)
  const cardForm = ref<CardFormRef>(null)
  const errorMessage = ref<string | null>(null)
  const isProcessing = ref(false)
  const success = ref(false)

  const { handleError, handleSuccess } = useErrorHandler()

  /**
   * Determina si el botón "Pagar ahora" debe estar habilitado.
   *
   * Requisitos:
   * - customer debe estar completo (emitido por CheckoutForm)
   * - payment.method debe estar seleccionado (emitido por PaymentMethods)
   *
   * NOTA: NO verifica si la tarjeta está tokenizada porque la tokenización
   * es AUTOMÁTICA al hacer clic en "Pagar ahora".
   */
  const canPay = computed(() => {
    // Verificar que haya customer
    if (!customer.value) {
      console.log('[canPay] No hay customer')
      return false
    }
    // Verificar que haya método de pago seleccionado
    if (!payment.value || !payment.value.method) {
      console.log('[canPay] No hay método de pago')
      return false
    }
    console.log('[canPay] OK - customer y payment method presentes')
    return true
  })

  function onCustomerConfirm(payload: Customer) {
    customer.value = payload
  }

  function onPaymentSelect(payload: PaymentMethod) {
    payment.value = payload
  }

  function onCardTokenized(tokenData: CardPaymentDetails) {
    payment.value = { method: 'card', details: tokenData }
  }

  /**
   * Tokeniza la tarjeta automáticamente antes de procesar el pago.
   *
   * Esta función se llama internamente desde `handlePayment()` si el método de pago
   * es 'card' y aún no hay detalles de tarjeta tokenizados.
   *
   * El usuario NO necesita hacer clic en "Tokenizar" - esto es transparente.
   * Solo llena los campos de la tarjeta y hace clic en "Pagar ahora".
   *
   * @returns TokenizePayload con token y datos de tarjeta, o null si falla
   */
  async function autoTokenizeCard() {
    if (!cardForm.value?.tokenizePayload) {
      return null
    }
    const res = await cardForm.value.tokenizePayload()
    if (!res || 'error' in res) return null
    return res
  }

  function setCardForm(refValue: CardFormRef) {
    cardForm.value = refValue
  }

  async function pay(total: number) {
    errorMessage.value = null
    isProcessing.value = true
    success.value = false
    try {
      if (!customer.value) throw new Error('Cliente no proporcionado')
      if (!payment.value || !payment.value.method) throw new Error('Método de pago no seleccionado')

      if (payment.value.method === 'card') {
        const res = await performCardPayment({
          customer: customer.value as Customer,
          payment: payment.value as PaymentMethod,
          cardForm: cardForm.value,
          total,
        })

        if (!res.success) {
          errorMessage.value = `Pago en estado: ${String(res.paymentIntent?.status ?? 'unknown')}`
          return res
        }

        handleSuccess('Pago confirmado. Completando orden...')
        success.value = true
        return res
      }

      success.value = true
      return { success: true }
    } catch (err: any) {
      const info = handleError(err, 'CheckoutStore')
      errorMessage.value = info.message
      success.value = false
      return { success: false, error: err }
    } finally {
      isProcessing.value = false
    }
  }

  async function performPay(total: number) {
    const res = await pay(total)
    if (!res || !res.success) {
      return { success: false, error: (res as any)?.error ?? null }
    }

    return {
      success: true,
      paymentIntent: (res as any).paymentIntent as PaymentIntent | undefined,
      payload: {
        customer: customer.value as Customer,
        payment: payment.value as PaymentMethod,
        paymentIntent: (res as any).paymentIntent as PaymentIntent | undefined,
      } as CompleteCheckoutPayload,
    }
  }

  /**
   * Maneja el flujo completo de pago con TOKENIZACIÓN AUTOMÁTICA.
   *
   * Para pagos con tarjeta:
   * 1. Verifica si la tarjeta ya fue tokenizada (payment.value.details existe)
   * 2. Si NO está tokenizada, llama a autoTokenizeCard() automáticamente
   * 3. Una vez tokenizada, procede con performPay() que crea el PaymentIntent
   *
   * El usuario solo ve:
   * - Llenar campos de tarjeta
   * - Clic en "Pagar ahora"
   * - El sistema tokeniza y procesa todo automáticamente
   *
   * @param total - Monto total a pagar
   * @returns CompleteCheckoutPayload con customer, payment y paymentIntent
   */
  async function handlePayment(total: number) {
    if (!customer.value) return null
    if (!payment.value || !payment.value.method) return null

    // TOKENIZACIÓN AUTOMÁTICA: Si el método es tarjeta y no está tokenizada
    if (payment.value.method === 'card') {
      // Si no hay detalles de tarjeta, tokenizar automáticamente (transparente para el usuario)
      if (!payment.value.details) {
        const tokenData = await autoTokenizeCard()
        if (tokenData) {
          payment.value = { method: 'card', details: tokenData }
        }
      }

      const res = await performPay(total)
      if (!res.success) return null
      return res.payload
    }

    // Otros métodos (no tarjeta): devolver payload básico
    return {
      customer: customer.value,
      payment: payment.value,
    } as CompleteCheckoutPayload
  }

  /**
   * Resetea el estado del checkout a sus valores iniciales.
   *
   * Útil para:
   * - Limpiar el estado al salir de la vista de checkout
   * - Preparar un nuevo checkout después de completar uno exitoso
   * - Evitar que mensajes de éxito persistan al volver al carrito
   */
  function resetCheckout() {
    customer.value = null
    payment.value = null
    cardForm.value = null
    errorMessage.value = null
    isProcessing.value = false
    success.value = false
  }

  return {
    customer,
    payment,
    cardForm,
    errorMessage,
    isProcessing,
    success,
    canPay,
    onCustomerConfirm,
    onPaymentSelect,
    onCardTokenized,
    setCardForm,
    pay,
    performPay,
    handlePayment,
    resetCheckout,
  }
})

export default useCheckoutStore
