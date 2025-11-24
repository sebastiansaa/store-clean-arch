import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CheckoutSidebar from '../CheckoutSidebar.vue'
import { ref } from 'vue'

const { mockUseCheckoutSidebar, mockHandlePay, mockOnCustomerConfirm, mockOnPaymentSelect } = vi.hoisted(() => {
  const handlePay = vi.fn()
  const onCustomerConfirm = vi.fn()
  const onPaymentSelect = vi.fn()

  const useCheckoutSidebar = vi.fn()

  return {
    mockUseCheckoutSidebar: useCheckoutSidebar,
    mockHandlePay: handlePay,
    mockOnCustomerConfirm: onCustomerConfirm,
    mockOnPaymentSelect: onPaymentSelect
  }
})

vi.mock('../../composables/useCheckoutSidebar', () => ({
  useCheckoutSidebar: mockUseCheckoutSidebar
}))

describe('CheckoutSidebar.vue', () => {
  // Default mock values factory to ensure fresh refs for each test
  const createDefaultMockValues = () => ({
    payment: ref({ method: 'card' }),
    errorMessage: ref(''),
    isProcessing: ref(false),
    success: ref(false),
    cardFormRef: ref(null),
    onCustomerConfirm: mockOnCustomerConfirm,
    onPaymentSelect: mockOnPaymentSelect,
    handlePay: mockHandlePay,
    canPay: ref(true),
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset default return value with fresh refs for each test
    mockUseCheckoutSidebar.mockReturnValue(createDefaultMockValues())
  })

  it('renders correctly', () => {
    const wrapper = mount(CheckoutSidebar)
    expect(wrapper.find('.checkout-sidebar').exists()).toBe(true)
  })

  it('disables pay button when processing or cannot pay', async () => {
    // Test caso 1: isProcessing = true
    const mockValues1 = createDefaultMockValues()
    mockValues1.isProcessing.value = true
    mockUseCheckoutSidebar.mockReturnValue(mockValues1)

    const wrapper1 = mount(CheckoutSidebar)
    const btn1 = wrapper1.find('button.primary')
    expect((btn1.element as HTMLButtonElement).disabled).toBe(true)

    // Test caso 2: canPay = false
    const mockValues2 = createDefaultMockValues()
    mockValues2.canPay.value = false
    mockUseCheckoutSidebar.mockReturnValue(mockValues2)

    const wrapper2 = mount(CheckoutSidebar)
    const btn2 = wrapper2.find('button.primary')
    expect((btn2.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('calls handlePay on click', async () => {
    mockHandlePay.mockResolvedValue(true)
    const wrapper = mount(CheckoutSidebar)
    const btn = wrapper.find('button.primary')

    await btn.trigger('click')
    expect(mockHandlePay).toHaveBeenCalled()
  })

  it.skip('displays error message and retry button when errorMessage is set', async () => {
    const errorMessage = ref('')
    const mockValues = createDefaultMockValues()
    mockValues.errorMessage = errorMessage
    mockUseCheckoutSidebar.mockReturnValue(mockValues)

    const wrapper = mount(CheckoutSidebar)
    errorMessage.value = 'Some error'
    await wrapper.vm.$nextTick()

    mockHandlePay.mockImplementation(() => {
      console.error('MOCK HANDLE PAY EXECUTED')
      return Promise.resolve(true)
    })

    const retryBtn = wrapper.find('button.secondary')
    expect(retryBtn.exists()).toBe(true)
    expect(retryBtn.text()).toBe('Reintentar')

    await retryBtn.element.dispatchEvent(new Event('click'))
    await flushPromises()

    expect(mockHandlePay).toHaveBeenCalled()
  })
})
