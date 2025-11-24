import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCheckoutStore } from '../checkoutStore'
import { CheckoutFailureReasons } from '../../types/reasons'

// Mock performCardPayment to avoid network and focus on orchestration
vi.mock('../../helpers/performCardPayment', () => ({
  performCardPayment: vi.fn(async ({ customer, payment, cardForm, total }) => {
    return {
      success: true,
      paymentIntent: { id: 'pi_mock', status: 'succeeded' },
    }
  }),
}))

vi.mock('../../helpers/cardTokenization', () => ({
  autoTokenizeCard: vi.fn()
}))

import { performCardPayment } from '../../helpers/performCardPayment'
import { autoTokenizeCard } from '../../helpers/cardTokenization'
import type { CardFormRef } from '../../interfaces/types'

describe('checkoutStore - handlePayment', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // Configurar mock por defecto de autoTokenizeCard
    vi.mocked(autoTokenizeCard).mockResolvedValue({ ok: true, payload: { token: 'default_tok', brand: 'visa' } })
  })

  it('tokeniza y llama a performCardPayment con la ref pasada', async () => {
    const store = useCheckoutStore()

    // Preparar customer y método de pago SIN details para que tokenize
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com', address: '123 St', phone: '555-5555' })
    store.onPaymentSelect({ method: 'card' })

    // Mock autoTokenizeCard success
    vi.mocked(autoTokenizeCard).mockResolvedValue({ ok: true, payload: { token: 'tok_123', brand: 'visa' } })

    const mockCardForm = { tokenizePayload: vi.fn() }
    const result = await store.handlePayment(1000, mockCardForm as unknown as CardFormRef)

    expect(result).toBeDefined()
    expect(result.ok).toBe(true)
    // El payment.details fue asignado a partir del token
    if (result.ok) {
      expect(result.payload.payment.details).toEqual({ token: 'tok_123', brand: 'visa' })
    }

    // performCardPayment fue llamado
    expect(performCardPayment).toHaveBeenCalled()
    const call = vi.mocked(performCardPayment).mock.calls[0][0]
    expect(call.cardForm).toBe(mockCardForm)
    expect(call.total).toBe(1000)
  })

  it('lanza si cardFormRef no tiene tokenizePayload', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com', address: '123 St', phone: '555-5555' })
    store.onPaymentSelect({ method: 'card' })

    const badForm = {}

    const bad = await store.handlePayment(500, badForm as unknown as CardFormRef)
    expect(bad).toBeDefined()
    expect(bad.ok).toBe(false)
    if (!bad.ok) {
      expect(bad.reason).toBe(CheckoutFailureReasons.INVALID_CARD_FORM)
    }
  })

  it('maneja tokenización fallida (TokenizeReasons.FAILED)', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com', address: '123 St', phone: '555-5555' })
    store.onPaymentSelect({ method: 'card' })

    // Mock autoTokenizeCard failure
    vi.mocked(autoTokenizeCard).mockResolvedValue({ ok: false, reason: 'FAILED', error: new Error('token error') })

    const mockCardForm = { tokenizePayload: vi.fn() }
    const res = await store.handlePayment(200, mockCardForm as unknown as CardFormRef)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.reason).toBe(CheckoutFailureReasons.TOKENIZATION_FAILED)
    }
  })

  it('maneja performCardPayment con success:false', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com', address: '123 St', phone: '555-5555' })
    store.onPaymentSelect({ method: 'card', details: { token: 'tok_123' } })

    // Forzar performCardPayment a devolver failure
    vi.mocked(performCardPayment).mockResolvedValueOnce({
      success: false,
      paymentIntent: { status: 'requires_payment_method', id: 'pi_fail', amount: 300, currency: 'eur', created: 123, client_secret: 'cs_123', capture_method: 'automatic', livemode: false, object: 'payment_intent', payment_method_types: ['card'] }
    })

    const mockCardForm = { tokenizePayload: vi.fn() }
    const res = await store.handlePayment(300, mockCardForm as unknown as CardFormRef)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.reason).toBe(CheckoutFailureReasons.PAYMENT_INCOMPLETE)
    }
  })

  it('maneja paymentIntent no succeeded', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com', address: '123 St', phone: '555-5555' })
    store.onPaymentSelect({ method: 'card', details: { token: 'tok_123' } })

    vi.mocked(performCardPayment).mockResolvedValueOnce({
      success: true,
      paymentIntent: { status: 'requires_action', id: 'pi_action', amount: 400, currency: 'eur', created: 123, client_secret: 'cs_123', capture_method: 'automatic', livemode: false, object: 'payment_intent', payment_method_types: ['card'] }
    })

    const mockCardForm = { tokenizePayload: vi.fn() }
    const res = await store.handlePayment(400, mockCardForm as unknown as CardFormRef)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.reason).toBe(CheckoutFailureReasons.PAYMENT_NOT_SUCCEEDED)
    }
  })

  it('devuelve not_ready si falta cliente', async () => {
    const store = useCheckoutStore()
    // No setActive customer
    store.onPaymentSelect({ method: 'card', details: {} })

    const mockCardForm = { tokenizePayload: vi.fn() }
    const res = await store.handlePayment(500, mockCardForm as unknown as CardFormRef)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.reason).toBe(CheckoutFailureReasons.NOT_READY)
    }
  })

  it('devuelve exception si ocurre un error inesperado', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com', address: '123 St', phone: '555-5555' })
    store.onPaymentSelect({ method: 'card', details: { token: 'tok_123' } })

    // Forzar error en performCardPayment
    vi.mocked(performCardPayment).mockRejectedValueOnce(new Error('Unexpected crash'))

    const mockCardForm = { tokenizePayload: vi.fn() }
    const res = await store.handlePayment(600, mockCardForm as unknown as CardFormRef)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.reason).toBe(CheckoutFailureReasons.EXCEPTION)
    }
  })
})
