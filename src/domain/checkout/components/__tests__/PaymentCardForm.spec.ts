import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentCardForm from '../PaymentCardForm.vue'
import usePaymentCard from '../../composables/usePaymentCard'
import { ref, computed } from 'vue'

vi.mock('../../composables/usePaymentCard')

describe('PaymentCardForm.vue', () => {
  // Backing refs for computed properties - estos nos permiten cambiar los valores en tests
  const mockProcessingState = ref(false)
  const mockErrorState = ref<string | null>(null)
  const mockModeState = ref<'mock' | 'stripe'>('mock')
  const mockTokenizingLabelState = ref('Tokenizing...')
  const mockIsFilledState = ref(false)

  const mockUsePaymentCard = {
    cardholder: ref(''),
    number: ref(''),
    exp: ref(''),
    cvc: ref(''),
    // Estos son ComputedRef que leen de los backing refs
    processing: computed(() => mockProcessingState.value),
    error: computed(() => mockErrorState.value),
    mode: computed(() => mockModeState.value),
    tokenizingLabel: computed(() => mockTokenizingLabelState.value),
    isFilled: computed(() => mockIsFilledState.value),
    stripeRef: ref(null),
    elementsRef: ref(null),
    cardElementRef: ref(null),
    tokenize: vi.fn(),
    tokenizePayload: vi.fn(),
    confirmPayment: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePaymentCard).mockReturnValue(mockUsePaymentCard)

    // Resetear backing refs
    mockProcessingState.value = false
    mockErrorState.value = null
    mockModeState.value = 'mock'
    mockTokenizingLabelState.value = 'Tokenizing...'
    mockIsFilledState.value = false

    // Resetear form fields
    mockUsePaymentCard.cardholder.value = ''
    mockUsePaymentCard.number.value = ''
    mockUsePaymentCard.exp.value = ''
    mockUsePaymentCard.cvc.value = ''
  })

  it('renders mock inputs in mock mode', () => {
    const wrapper = mount(PaymentCardForm)
    expect(wrapper.find('input[placeholder="4242 4242 4242 4242"]').exists()).toBe(true)
    expect(wrapper.find('.stripe-card').exists()).toBe(false)
  })

  it('renders stripe container in stripe mode', async () => {
    mockModeState.value = 'stripe'
    const wrapper = mount(PaymentCardForm)
    expect(wrapper.find('.stripe-card').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="4242 4242 4242 4242"]').exists()).toBe(false)
  })

  it('formats card number input', async () => {
    const wrapper = mount(PaymentCardForm)
    const input = wrapper.find('input[placeholder="4242 4242 4242 4242"]')

    await input.setValue('1234567812345678')
    expect(mockUsePaymentCard.number.value).toBe('1234 5678 1234 5678')
    expect((input.element as HTMLInputElement).value).toBe('1234 5678 1234 5678')
  })

  it('formats expiration date input', async () => {
    const wrapper = mount(PaymentCardForm)
    const input = wrapper.find('input[placeholder="04/28"]')

    await input.setValue('1225')
    expect(mockUsePaymentCard.exp.value).toBe('12/25')
    expect((input.element as HTMLInputElement).value).toBe('12/25')
  })

  it('displays error message', async () => {
    mockErrorState.value = 'Some error'
    const wrapper = mount(PaymentCardForm)
    expect(wrapper.find('.error').text()).toBe('Some error')
  })

  it('exposes methods', () => {
    const wrapper = mount(PaymentCardForm)
    expect(wrapper.vm.confirmPayment).toBeDefined()
    expect(wrapper.vm.tokenizePayload).toBeDefined()
  })
})
