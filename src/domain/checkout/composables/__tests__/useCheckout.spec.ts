import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useCheckout } from '../useCheckout'
import { cartStore } from '../../../cart/stores/cartStore'
import { completeCheckout } from '../../services/paymentService'
import { persistOrder, clearLocalCart } from '../../helpers/persistence'
import { useRouter } from 'vue-router'
import type { CompleteCheckoutPayload } from '../../interfaces/types'
import type { Router } from 'vue-router'

// Mocks
vi.mock('vue-router')
vi.mock('../../../cart/stores/cartStore')
vi.mock('../../services/paymentService')
vi.mock('../../helpers/persistence')

// Mock useMutation since it's from @tanstack/vue-query and might need a provider context
interface MutationOptions {
  mutationFn: (args: unknown) => Promise<unknown>
  onSuccess?: (data: unknown) => void
  onError?: (error: unknown) => void
}

vi.mock('@tanstack/vue-query', () => ({
  useMutation: (options: MutationOptions) => {
    // Create reactive refs that will be updated
    const isPending = ref(false)
    const isSuccess = ref(false)
    const error = ref<Error | null>(null)

    const mutate = (args: unknown) => {
      isPending.value = true
      error.value = null
      // Simulate async call
      options.mutationFn(args)
        .then((data: unknown) => {
          isPending.value = false
          isSuccess.value = true
          if (options.onSuccess) options.onSuccess(data)
        })
        .catch((err: unknown) => {
          isPending.value = false
          error.value = err as Error
          if (options.onError) options.onError(err)
        })
    }
    return {
      mutate,
      mutateAsync: async (args: unknown) => {
        isPending.value = true
        error.value = null
        try {
          const data = await options.mutationFn(args)
          isPending.value = false
          isSuccess.value = true
          if (options.onSuccess) options.onSuccess(data)
          return data
        } catch (err) {
          isPending.value = false
          error.value = err as Error
          if (options.onError) options.onError(err)
          throw err
        }
      },
      isPending,
      isSuccess,
      error
    }
  }
}))

describe('useCheckout', () => {
  interface MockRouter {
    back: ReturnType<typeof vi.fn>
    push: ReturnType<typeof vi.fn>
  }

  interface MockCart {
    total: number
    items: unknown[]
  }

  let mockRouter: MockRouter
  let mockCart: MockCart

  beforeEach(() => {
    mockRouter = { back: vi.fn(), push: vi.fn() }
    mockCart = { total: 10, items: [] }

    vi.mocked(useRouter).mockReturnValue(mockRouter as unknown as Router)

    vi.mocked(cartStore).mockReturnValue(mockCart as never)

    vi.mocked(persistOrder).mockImplementation(() => { })
    vi.mocked(clearLocalCart).mockImplementation(() => { })

    const mockResponse = { success: true, orderId: 'order_123' }
    vi.mocked(completeCheckout).mockResolvedValue(mockResponse)
  })

  it('performCheckout successfully creates an order', async () => {
    const { error, success, performCheckoutAsync } = useCheckout()

    const payload: CompleteCheckoutPayload = {
      customer: { fullName: 'John', email: 'john@test.com', address: '123 St', phone: '555-1234' },
      payment: { method: 'card', details: { token: 'tok_123', brand: 'visa' } }
    }

    const result = await performCheckoutAsync(payload)

    expect(result).toBeDefined()
    expect(success.value).toBe(true)
    expect(error.value).toBeNull()
  })

  it('handles errors during checkout', async () => {
    const { error, performCheckoutAsync } = useCheckout()

    const payload: CompleteCheckoutPayload = {
      customer: { fullName: 'John', email: 'john@test.com', address: '123 St', phone: '555-1234' },
      payment: { method: 'card', details: { token: 'tok_456', brand: 'visa' } }
    }
    const err = new Error('Server error')
    vi.mocked(completeCheckout).mockRejectedValue(err)

    await expect(performCheckoutAsync(payload)).rejects.toThrow('Server error')
    expect(error.value).toBe(err)
  })
})
