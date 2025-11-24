import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckoutView from '../CheckoutView.vue'
import { createTestingPinia } from '@pinia/testing'
import { cartStore } from '../../../cart/stores/cartStore'
import { useCheckoutStore } from '../../stores/checkoutStore'
import { useCheckout } from '../../composables/useCheckout'
import { useRouter } from 'vue-router'
import { prefetchStripe } from '../../helpers/stripe'

vi.mock('../../composables/useCheckout')
vi.mock('vue-router')
vi.mock('../../helpers/stripe')

interface MockRouter {
  back: ReturnType<typeof vi.fn>
  push: ReturnType<typeof vi.fn>
}

interface MockUseCheckout {
  processing: boolean
  success: boolean
  performCheckout: ReturnType<typeof vi.fn>
  error: Error | null
}

describe('CheckoutView.vue', () => {
  let mockRouter: MockRouter
  let mockUseCheckout: MockUseCheckout

  beforeEach(() => {
    vi.clearAllMocks()
    mockRouter = { back: vi.fn(), push: vi.fn() }
      ; (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter)

    mockUseCheckout = {
      processing: false,
      success: false,
      performCheckout: vi.fn(),
      error: null
    }
      ; (useCheckout as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockUseCheckout)
      ; vi.mocked(prefetchStripe).mockResolvedValue(true)
  })

  const mountComponent = () => {
    return mount(CheckoutView, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })],
        stubs: {
          CheckoutSummary: true,
          CheckoutSidebar: true
        }
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.checkout-page').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CheckoutSummary' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CheckoutSidebar' }).exists()).toBe(true)
  })

  it('prefetches stripe on mount', () => {
    mountComponent()
    expect(prefetchStripe).toHaveBeenCalled()
  })

  it('resets checkout store on unmount', () => {
    const wrapper = mountComponent()
    const store = useCheckoutStore()
    wrapper.unmount()
    expect(store.resetCheckout).toHaveBeenCalled()
  })

  it('handles remove item from summary', () => {
    const wrapper = mountComponent()
    const cart = cartStore()
    const summary = wrapper.findComponent({ name: 'CheckoutSummary' })

    summary.vm.$emit('remove', 123)
    expect(cart.removeFromCart).toHaveBeenCalledWith(123)
  })

  it('handles cancel from sidebar', () => {
    const wrapper = mountComponent()
    const sidebar = wrapper.findComponent({ name: 'CheckoutSidebar' })

    sidebar.vm.$emit('cancel')
    expect(mockRouter.back).toHaveBeenCalled()
  })

  it('handles confirm from sidebar', () => {
    const wrapper = mountComponent()
    const sidebar = wrapper.findComponent({ name: 'CheckoutSidebar' })
    const formData = { some: 'data' }

    sidebar.vm.$emit('confirm', formData)
    expect(mockUseCheckout.performCheckout).toHaveBeenCalledWith(formData)
  })

  it('displays error message if present', () => {
    mockUseCheckout.error = new Error('Checkout failed')
    const wrapper = mountComponent()
    expect(wrapper.find('.error').text()).toBe('Checkout failed')
  })
})
