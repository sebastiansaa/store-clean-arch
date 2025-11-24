import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckoutForm from '../CheckoutForm.vue'
import { useCheckoutForm } from '../../composables/useCheckoutForm'
import { ref, reactive, computed, type Ref, type ComputedRef } from 'vue'

vi.mock('../../composables/useCheckoutForm')

// Variables y funciones mockeadas
const mockOnSubmit = vi.fn()
const mockFullName = ref('') as Ref<string>
const mockAddress = ref('') as Ref<string>
const mockPhone = ref('') as Ref<string>
const mockEmail = ref('') as Ref<string>

// Definición de tipos
type CheckoutValues = {
  fullName: string
  address: string
  phone: string
  email: string
}

// Create a reactive proxy that automatically syncs with the refs
// This ensures that when refs change, the mockValues object updates automatically
const mockValues = reactive({
  get fullName() { return mockFullName.value },
  set fullName(v) { mockFullName.value = v },
  get address() { return mockAddress.value },
  set address(v) { mockAddress.value = v },
  get phone() { return mockPhone.value },
  set phone(v) { mockPhone.value = v },
  get email() { return mockEmail.value },
  set email(v) { mockEmail.value = v },
})

// 2. 🚨 MOCK DE 'formErrors': Debe ser un COMPUTEDREF (con el tipo de errores)
// Usamos el tipo revelado por el error (Partial<Record<clave, string | undefined>>)
type FormErrors = Partial<Record<keyof CheckoutValues | "", string | undefined>>

const mockFormErrors: ComputedRef<FormErrors> = computed(() => ({}))


// Configuración del mock del composable
vi.mocked(useCheckoutForm).mockReturnValue({
  fullName: mockFullName,
  fullNameError: ref(undefined) as Ref<string | undefined>,
  fullNameBlur: vi.fn(),

  address: mockAddress,
  addressError: ref(undefined) as Ref<string | undefined>,
  addressBlur: vi.fn(),

  phone: mockPhone,
  phoneError: ref(undefined) as Ref<string | undefined>,
  phoneBlur: vi.fn(),

  email: mockEmail,
  emailError: ref(undefined) as Ref<string | undefined>,
  emailBlur: vi.fn(),

  // Usamos los mocks ajustados al tipado revelado:
  values: mockValues, // Objeto reactive plano
  formErrors: mockFormErrors, // ComputedRef
  onSubmit: mockOnSubmit,
})

// -------------------------------------------------------------

describe('CheckoutForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Resetear los valores de los refs
    mockFullName.value = ''
    mockAddress.value = ''
    mockPhone.value = ''
    mockEmail.value = ''

    // Resetear el objeto reactive mockValues (si el componente lo mutara)
    // Sin embargo, si el componente se basa solo en los refs individuales,
    // esta mutación es menos crítica, pero la mantenemos para completitud.
    Object.assign(mockValues, { fullName: '', address: '', phone: '', email: '' })
    // Resetear formErrors si fuera necesario (aunque computed(() => ({})) siempre da {})
  })

  it('renderiza todos los campos de entrada', () => {
    const wrapper = mount(CheckoutForm)
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBe(4)
  })

  it('emite "confirm" si el formulario es válido y onSubmit resuelve a true', async () => {
    mockOnSubmit.mockResolvedValue(true)

    const wrapper = mount(CheckoutForm)

    // Clear mock calls from initial mount/watch trigger
    await wrapper.vm.$nextTick()
    mockOnSubmit.mockClear()

    // Simular el llenado de campos (usando los refs que el componente lee)
    mockFullName.value = 'John Doe'
    mockAddress.value = '123 Main St'
    mockPhone.value = '555-1234'
    mockEmail.value = 'john@example.com'

    await wrapper.vm.$nextTick()

    // Esperar a que la promesa asíncrona (onSubmit) se resuelva
    await new Promise(r => setTimeout(r, 10))

    // El watch puede dispararse múltiples veces al cambiar varios campos,
    // pero lo importante es que se llamó y que emitió 'confirm'
    expect(mockOnSubmit).toHaveBeenCalled()
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('NO emite "confirm" cuando onSubmit resuelve a false', async () => {
    mockOnSubmit.mockResolvedValue(false)

    const wrapper = mount(CheckoutForm)

    // Simular el llenado de campos
    mockFullName.value = 'John Doe'
    mockAddress.value = '123 Main St'
    mockPhone.value = '555-1234'
    mockEmail.value = 'john@example.com'

    await wrapper.vm.$nextTick()

    // Simular el envío del formulario
    await wrapper.find('form').trigger('submit')

    // Esperar a que la promesa asíncrona se resuelva
    await new Promise(r => setTimeout(r, 0))

    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('confirm')).toBeFalsy()
  })
})
