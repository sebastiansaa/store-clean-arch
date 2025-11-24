import { describe, it, expect, vi, beforeEach } from 'vitest'
import { initStripeElements } from '../stripe'
import type { Stripe } from '@stripe/stripe-js'

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn()
}))

describe('stripe helper', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('returns mock mode if forceMock is true', async () => {
    const result = await initStripeElements('key', null, true)
    expect(result.mode).toBe('mock')
    expect(result.stripe).toBeNull()
  })

  it('returns mock mode if key is missing', async () => {
    const result = await initStripeElements(undefined, null, false)
    expect(result.mode).toBe('mock')
  })

  it('returns stripe mode if key is present and loadStripe succeeds', async () => {
    const mockStripe = { elements: vi.fn(() => ({ create: vi.fn() })) } as unknown as Stripe
    const { loadStripe } = await import('@stripe/stripe-js')
    vi.mocked(loadStripe).mockResolvedValue(mockStripe)

    // We need a container to fully succeed
    const container = document.createElement('div')
    // Mock mount on the card element
    const mockCard = { mount: vi.fn() }
    const mockElements = { create: vi.fn().mockReturnValue(mockCard) };
    (mockStripe.elements as ReturnType<typeof vi.fn>).mockReturnValue(mockElements)

    const result = await initStripeElements('pk_test', container, false)

    expect(loadStripe).toHaveBeenCalledWith('pk_test')
    expect(result.mode).toBe('stripe')
    expect(result.stripe).toBe(mockStripe)
  })
})
