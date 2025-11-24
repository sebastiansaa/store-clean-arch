import { describe, it, expect, vi, beforeEach } from 'vitest'
import { persistOrder, clearLocalCart } from '../persistence'

interface MockCart {
  clearCart?: () => void
  removeFromCart?: (id: number) => void
  cartItems?: { product: { id: number } }[]
}

describe('persistence', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'setItem')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('persistOrder saves order to localStorage', () => {
    const items = [{ product: { id: 1, title: 'P1', price: 10 }, quantity: 1 }]
    persistOrder('order_1', items, 10)

    expect(localStorage.setItem).toHaveBeenCalledWith('orders', expect.stringContaining('order_1'))
    expect(localStorage.setItem).toHaveBeenCalledWith('orders', expect.stringContaining('P1'))
  })

  it('clearLocalCart calls clearCart if available', () => {
    const mockCart: MockCart = { clearCart: vi.fn() }
    clearLocalCart(mockCart)
    expect(mockCart.clearCart).toHaveBeenCalled()
  })

  it('clearLocalCart calls removeFromCart for each item if clearCart not available', () => {
    const mockCart: MockCart = {
      cartItems: [{ product: { id: 1 } }, { product: { id: 2 } }],
      removeFromCart: vi.fn()
    }
    clearLocalCart(mockCart)
    expect(mockCart.removeFromCart).toHaveBeenCalledTimes(2)
    expect(mockCart.removeFromCart).toHaveBeenCalledWith(1)
    expect(mockCart.removeFromCart).toHaveBeenCalledWith(2)
  })
})
