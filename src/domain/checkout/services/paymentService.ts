import { serverAdapter } from '@/shared/api/serverAdapter'
import { FORCE_MOCK_PAYMENTS as forceMock } from '@/shared/config'

// Tipado explícito de la respuesta que esperamos del backend al crear PaymentIntent
export interface CreatePaymentIntentResponse {
  client_secret: string
}

export interface CompleteCheckoutResponse {
  success: boolean
  orderId?: string
}

export async function createPaymentIntent(
  amount: number,
  currency = 'eur',
): Promise<CreatePaymentIntentResponse> {
  // En modo mock no llamamos al backend: devolvemos un client_secret simulado
  if (forceMock) {
    return { client_secret: `cs_mock_${Date.now()}` }
  }

  try {
    const resp = await serverAdapter.post('/api/create-payment-intent', { amount, currency })
    return resp.data as CreatePaymentIntentResponse
  } catch (err: any) {
    const msg = err?.response?.data || err?.message || String(err)
    throw new Error(`createPaymentIntent failed: ${msg}`)
  }
}

import type { CompleteCheckoutPayload } from '@/domain/checkout/interfaces/types'

export async function completeCheckout(payload: CompleteCheckoutPayload) {
  // En modo mock devolvemos una respuesta simulada
  if (forceMock) {
    return { success: true, orderId: `order_mock_${Date.now()}` } as CompleteCheckoutResponse
  }

  try {
    const resp = await serverAdapter.post('/api/complete-checkout', payload)
    return resp.data as CompleteCheckoutResponse
  } catch (err: any) {
    const msg = err?.response?.data || err?.message || String(err)
    throw new Error(`completeCheckout failed: ${msg}`)
  }
}
