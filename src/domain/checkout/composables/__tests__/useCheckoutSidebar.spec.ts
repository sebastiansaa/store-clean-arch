import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCheckoutSidebar } from '../useCheckoutSidebar'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { useCheckoutStore } from '../../stores/checkoutStore'
import type { CardFormRef, CompleteCheckoutPayload } from '../../interfaces/types'

describe('useCheckoutSidebar', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({
      createSpy: vi.fn,
      stubActions: false
    }))
  })

  it('initializes with store state', () => {
    const store = useCheckoutStore()
    store.customer = { fullName: 'John', email: 'j@j.com', address: '123', phone: '555-1234' }
    store.payment = { method: 'card' as const, details: {} }

    const { customer, payment } = useCheckoutSidebar()

    expect(customer.value).toEqual({ fullName: 'John', email: 'j@j.com', address: '123', phone: '555-1234' })
    expect(payment.value).toEqual({ method: 'card', details: {} })
  })

  it('handlePay calls store handlePayment with correct args', async () => {
    const store = useCheckoutStore()
    store.handlePayment = vi.fn().mockResolvedValue({ ok: true, payload: {} as CompleteCheckoutPayload })
    store.payment = { method: 'card' as const, details: {} }

    const { handlePay, cardFormRef } = useCheckoutSidebar()

    // Mock cardFormRef
    const mockCardRef = { isFilled: true, tokenizePayload: vi.fn() }
    cardFormRef.value = mockCardRef as unknown as CardFormRef

    await handlePay(100)

    expect(store.handlePayment).toHaveBeenCalledWith(100, mockCardRef)
  })

  it('handlePay returns error if card method and no card ref', async () => {
    const store = useCheckoutStore()
    store.payment = { method: 'card' as const, details: {} }

    const { handlePay, cardFormRef } = useCheckoutSidebar()
    cardFormRef.value = null

    const result = await handlePay(100)
    expect(result).toEqual({ ok: false, reason: 'form_missing' })
  })

  it('canPay returns correct status', () => {
    const store = useCheckoutStore()
    const { canPay, cardFormRef } = useCheckoutSidebar()

    // Case 1: Not ready
    store.isCheckoutReady = false
    expect(canPay.value).toBe(false)

    // Case 2: Ready, not card
    store.isCheckoutReady = true
    store.payment = { method: 'cash' as const }
    expect(canPay.value).toBe(true)

    // Case 3: Ready, card, not filled
    store.payment = { method: 'card' as const, details: {} }
    cardFormRef.value = { isFilled: false } as unknown as CardFormRef
    expect(canPay.value).toBe(false)

    // Case 4: Ready, card, filled
    cardFormRef.value = { isFilled: true } as unknown as CardFormRef
    expect(canPay.value).toBe(true)
  })
})
