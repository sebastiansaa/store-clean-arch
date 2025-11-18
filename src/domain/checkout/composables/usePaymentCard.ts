import { ref, onMounted, onBeforeUnmount } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { FORCE_MOCK_PAYMENTS as forceMock, STRIPE_PUBLISHABLE_KEY } from '@/shared/config'

type StripeRef = any

export type TokenizeSuccess = {
  token: string
  last4?: string | null
  brand?: string | null
  cardholder?: string | null
}

export type TokenizeError = { error: any }

export type TokenizeResult = TokenizeSuccess | TokenizeError

export type TokenizePayload = {
  token: string
  last4?: string | null
  brand?: string | null
  cardholder?: string | null
}
/*
rquesta el flujo completo de pago con tarjeta:
 * - Valida los parámetros esenciales (cliente, método, total, formulario)
 * - Crea un `PaymentIntent` vía backend (mock o real)
 * - Confirma el pago en el cliente (Stripe Elements o mock)
 * Devuelve un resultado estructurado con `success`, el `paymentIntent` y deja la finalización del checkout
 * (creación de orden) a cargo del caller para evitar duplicación de lógica.
 * Lanza errores explícitos si falta algún dato clave o si falla la confirmación.
*/
export const usePaymentCard = (publishableKey?: string, containerRef?: { value: HTMLElement | null }) => {
  // Forzar modo mock desde config centralizada

  const cardholder = ref('')
  const number = ref('')
  const exp = ref('')
  const cvc = ref('')
  const processing = ref(false)
  const error = ref<string | null>(null)
  const mode = ref<'stripe' | 'mock'>('mock')
  const tokenizingLabel = ref('Tokenizando...')

  // Stripe refs
  const stripeRef: { value: StripeRef | null } = ref(null)
  const elementsRef: { value: any | null } = ref(null)
  const cardElementRef: { value: any | null } = ref(null)

  /**
   * Detecta la marca de tarjeta basándose en el número
   * @param num - Número de tarjeta
   * @returns Marca de la tarjeta: 'visa', 'mastercard', 'amex' o 'unknown'
   */
  const detectBrand = (num: string) => {
    if (/^4/.test(num)) return 'visa'
    if (/^5[1-5]/.test(num)) return 'mastercard'
    if (/^3[47]/.test(num)) return 'amex'
    return 'unknown'
  }

  /**
   * Inicializa Stripe Elements en el contenedor proporcionado.
   * Si falla o está en modo mock, usa el fallback de inputs manuales.
   * Se ejecuta automáticamente al montar el componente.
   */
  onMounted(async () => {
    try {
      if (forceMock) {
        mode.value = 'mock'
        return
      }

      const key = publishableKey ?? (import.meta.env.VITE_STRIPE_PK as string | undefined)
      if (!key) {
        mode.value = 'mock'
        return
      }

      stripeRef.value = await loadStripe(key)
      if (!stripeRef.value) {
        mode.value = 'mock'
        return
      }

      elementsRef.value = stripeRef.value.elements()
      cardElementRef.value = elementsRef.value.create('card', { style: { base: { fontSize: '16px' } } })

      if (containerRef?.value && cardElementRef.value && cardElementRef.value.mount) {
        cardElementRef.value.mount(containerRef.value)
        mode.value = 'stripe'
      } else {
        mode.value = 'mock'
      }
    } catch (err) {
      mode.value = 'mock'
    }
  })

  /**
   * Limpia los recursos de Stripe Elements antes de desmontar el componente.
   * Desmonta el cardElement del DOM de forma segura.
   */
  onBeforeUnmount(() => {
    try {
      cardElementRef.value?.unmount()
    } catch (e) {
      /* ignore */
    }
  })

  /**
   * Tokeniza la tarjeta usando Stripe o mock según el modo activo.
   * En modo Stripe: crea un PaymentMethod usando Stripe Elements.
   * En modo mock: genera un token simulado con validación básica de campos.
   * @returns TokenizeResult con token y datos de tarjeta, o error
   */
  const tokenize = async (): Promise<TokenizeResult | undefined> => {
    error.value = null
    processing.value = true
    try {
      if (mode.value === 'stripe' && stripeRef.value && cardElementRef.value) {
        const res = await stripeRef.value.createPaymentMethod({
          type: 'card',
          card: cardElementRef.value,
          billing_details: { name: cardholder.value || undefined },
        })
        if (res.error) {
          error.value = res.error.message || 'Error al tokenizar con Stripe'
          return { error: res.error }
        }
        const pm = res.paymentMethod
        return {
          token: pm.id,
          last4: pm.card?.last4 ?? null,
          brand: pm.card?.brand ?? null,
          cardholder: cardholder.value,
        }
      }

      // Mock fallback
      if (!number.value || !exp.value || !cvc.value) {
        error.value = 'Completa los datos de la tarjeta.'
        return { error: new Error(error.value) }
      }
      const sanitized = number.value.replace(/\s+/g, '')
      const last4 = sanitized.slice(-4)
      const brand = detectBrand(sanitized)
      await new Promise((r) => setTimeout(r, 600))
      const token = `tok_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      return { token, last4, brand, cardholder: cardholder.value }
    } catch (err: any) {
      error.value = err?.message ?? String(err)
      return { error: err }
    } finally {
      processing.value = false
    }
  }

  /**
   * Wrapper de tokenize que normaliza el resultado al formato TokenizePayload.
   * Útil para componentes que necesitan un payload consistente para emitir eventos.
   * @returns TokenizePayload con datos normalizados, TokenizeError, o undefined
   */
  const tokenizePayload = async (): Promise<{
    token: string
    last4?: string | null
    brand?: string | null
    cardholder?: string | null
  } | TokenizeError | undefined> => {
    const res = await tokenize()
    if (!res) return undefined
    if ('error' in res) return res
    return {
      token: res.token,
      last4: res.last4 ?? null,
      brand: res.brand ?? null,
      cardholder: res.cardholder ?? cardholder.value ?? null,
    }
  }

  /**
   * Confirma el pago en el cliente usando el client_secret del PaymentIntent.
   * En modo Stripe: ejecuta confirmCardPayment con 3DS si es necesario.
   * En modo mock: simula confirmación exitosa con delay.
   * @param clientSecret - El client_secret del PaymentIntent creado en backend
   * @returns Objeto con paymentIntent si exitoso, o error
   */
  const confirmPayment = async (clientSecret: string) => {
    error.value = null
    processing.value = true
    try {
      if (mode.value === 'stripe' && stripeRef.value && cardElementRef.value) {
        const res = await stripeRef.value.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElementRef.value,
            billing_details: { name: cardholder.value || undefined },
          },
        })
        if (res.error) {
          error.value = res.error.message || 'Error en la confirmación del pago'
          return { error: res.error }
        }
        return { paymentIntent: res.paymentIntent }
      }

      // Modo mock: simulamos confirmación exitosa
      await new Promise((r) => setTimeout(r, 800))
      return { paymentIntent: { status: 'succeeded', id: `pi_mock_${Date.now()}` } }
    } catch (err: any) {
      error.value = err?.message ?? String(err)
      return { error: err }
    } finally {
      processing.value = false
    }
  }

  return {
    // state
    cardholder,
    number,
    exp,
    cvc,
    processing,
    error,
    mode,
    tokenizingLabel,
    // stripe refs (expuestos por compatibilidad)
    stripeRef,
    elementsRef,
    cardElementRef,
    // actions
    tokenize,
    tokenizePayload,
    confirmPayment,
  }
}

export default usePaymentCard
