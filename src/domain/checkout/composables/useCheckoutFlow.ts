import type { Ref } from 'vue'
import { createPaymentIntent } from '@/domain/checkout/services/paymentService'
import type { Customer, PaymentMethod, PaymentIntent, Order, CardPaymentDetails } from '@/domain/checkout/interfaces/types'

export type CardFormRef = {
  confirmPayment: (clientSecret: string) => Promise<{ paymentIntent?: PaymentIntent; error?: any }>
  tokenizePayload?: () => Promise<any>
} | null

export interface PerformCardPaymentParams {
  customer: Customer
  payment: PaymentMethod
  cardForm: CardFormRef | null
  total: number
}

export interface PerformCardPaymentResult {
  success: boolean
  paymentIntent?: PaymentIntent
  order?: Order
}

/* Ejecuta el flujo de pago con tarjeta: valida datos, crea el `PaymentIntent` y lo confirma (Stripe o mock).
 * Devuelve `{ success, paymentIntent }`. La creación de la orden queda a cargo del caller.
 * Lanza errores si falta información o falla la confirmación.
*/
export async function performCardPayment(params: PerformCardPaymentParams): Promise<PerformCardPaymentResult> {
  const { customer, payment, cardForm, total } = params

  if (!customer) throw new Error('Cliente no proporcionado')
  if (!payment || !payment.method) throw new Error('Método de pago no seleccionado')
  if (!total || Number(total) <= 0) throw new Error('Importe inválido para crear PaymentIntent')

  if (!cardForm || typeof cardForm.confirmPayment !== 'function') {
    throw new Error('Formulario de tarjeta no disponible para confirmar pago')
  }

  // Crear PaymentIntent (paymentService maneja mock si corresponde)
  const data = await createPaymentIntent(total, 'eur')
  const clientSecret = data?.client_secret
  if (!clientSecret) throw new Error('client_secret no devuelto por el backend')

  // Confirmar el pago en el cliente (Stripe Elements o mock interno)
  const result = await cardForm.confirmPayment(clientSecret)
  if (result?.error) throw result.error

  const pi = result.paymentIntent

  // Si no está succeeded, devolvemos estado parcial
  if (pi && pi.status && pi.status !== 'succeeded') {
    return { success: false, paymentIntent: pi }
  }

  // NOTA: no completamos la orden aquí — solo creamos y confirmamos el PaymentIntent.
  // La finalización del checkout (persistir la orden) debe realizarse por el caller
  // (p. ej. `useCheckout`/`CheckoutView`) para evitar duplicar la acción.
  return { success: true, paymentIntent: pi }
}

export default performCardPayment
