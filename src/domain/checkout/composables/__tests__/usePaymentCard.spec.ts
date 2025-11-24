import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePaymentCard } from '../usePaymentCard'
import { initStripeElements } from '../../helpers/stripe'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { Stripe } from '@stripe/stripe-js'

vi.mock('../../helpers/stripe')

const TestComponent = defineComponent({
  setup() {
    return { ...usePaymentCard() }
  },
  template: '<div></div>'
})

describe('usePaymentCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(initStripeElements).mockResolvedValue({
      stripe: {
        createPaymentMethod: vi.fn(),
        confirmCardPayment: vi.fn()
      } as unknown as Stripe,
      elements: {},
      card: {},
      mode: 'mock'
    })
  })

  it('initializes in mock mode by default or if stripe fails', async () => {
    const wrapper = mount(TestComponent)
    // Wait for onMounted
    await new Promise(process.nextTick)

    expect(initStripeElements).toHaveBeenCalled()
    expect(wrapper.vm.mode).toBe('mock')
  })

  it('tokenize in mock mode returns token', async () => {
    const wrapper = mount(TestComponent)
    await new Promise(process.nextTick)

    // Fill data
    wrapper.vm.number = '4242424242424242'
    wrapper.vm.exp = '12/24'
    wrapper.vm.cvc = '123'
    wrapper.vm.cardholder = 'John Doe'

    const result = await wrapper.vm.tokenize()

    expect(result).toHaveProperty('token')
    expect(result?.token).toMatch(/^tok_mock_/)
    expect(result?.last4).toBe('4242')
    expect(result?.brand).toBe('visa')
  })

  it('tokenize in mock mode returns error if empty', async () => {
    const wrapper = mount(TestComponent)
    await new Promise(process.nextTick)

    const result = await wrapper.vm.tokenize()

    expect(result).toHaveProperty('error')
  })
})
