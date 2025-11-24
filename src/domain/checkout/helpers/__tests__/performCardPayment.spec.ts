import { describe, it, expect, vi, beforeEach } from 'vitest'
import { performCardPayment } from '../performCardPayment'
import { createPaymentIntent } from '../../services/paymentService'
import type { Customer, PaymentMethod, CardFormRef } from '../../interfaces/types'

vi.mock('../../services/paymentService')
vi.mock('../../../../shared/services/logger')

interface MockCardForm {
  confirmPayment: ReturnType<typeof vi.fn>
}

describe('performCardPayment', () => {
  const mockCustomer: Customer = { fullName: 'John', email: 'john@test.com', address: '123 St', phone: '555-1234' }
  const mockPayment: PaymentMethod = { method: 'card' as const, details: {} }
  const mockCardForm: MockCardForm = { confirmPayment: vi.fn() }
  const total = 100

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates customer', async () => {
    await expect(performCardPayment({ customer: null, payment: mockPayment, cardForm: mockCardForm as unknown as CardFormRef, total }))
      .rejects.toMatchObject({ code: 'MISSING_CUSTOMER' })
  })

  it('validates payment method', async () => {
    await expect(performCardPayment({ customer: mockCustomer, payment: {} as unknown as PaymentMethod, cardForm: mockCardForm as unknown as CardFormRef, total }))
      .rejects.toMatchObject({ code: 'MISSING_PAYMENT_METHOD' })
  })

  it('validates total', async () => {
    await expect(performCardPayment({ customer: mockCustomer, payment: mockPayment, cardForm: mockCardForm as unknown as CardFormRef, total: 0 }))
      .rejects.toMatchObject({ code: 'INVALID_AMOUNT' })
  })

  it('validates cardForm', async () => {
    await expect(performCardPayment({ customer: mockCustomer, payment: mockPayment, cardForm: null, total }))
      .rejects.toMatchObject({ code: 'INVALID_CARD_FORM' })
  })

  it('throws if createPaymentIntent returns no client_secret', async () => {
    vi.mocked(createPaymentIntent).mockResolvedValue({})
    await expect(performCardPayment({ customer: mockCustomer, payment: mockPayment, cardForm: mockCardForm as unknown as CardFormRef, total }))
      .rejects.toMatchObject({ code: 'MISSING_CLIENT_SECRET' })
  })

  it('calls confirmPayment and returns success', async () => {
    vi.mocked(createPaymentIntent).mockResolvedValue({ client_secret: 'secret_123' })
    mockCardForm.confirmPayment.mockResolvedValue({ paymentIntent: { status: 'succeeded', id: 'pi_123' } })

    const result = await performCardPayment({ customer: mockCustomer, payment: mockPayment, cardForm: mockCardForm as unknown as CardFormRef, total })

    expect(createPaymentIntent).toHaveBeenCalledWith(total, 'eur')
    expect(mockCardForm.confirmPayment).toHaveBeenCalledWith('secret_123')
    expect(result).toEqual({ success: true, paymentIntent: { status: 'succeeded', id: 'pi_123' } })
  })

  it('throws if confirmPayment returns error', async () => {
    vi.mocked(createPaymentIntent).mockResolvedValue({ client_secret: 'secret_123' })
    mockCardForm.confirmPayment.mockResolvedValue({ error: { message: 'Card declined', code: 'card_declined' } })

    await expect(performCardPayment({ customer: mockCustomer, payment: mockPayment, cardForm: mockCardForm as unknown as CardFormRef, total }))
      .rejects.toMatchObject({ stage: 'confirm', message: 'Card declined' })
  })
})
