import { describe, it, expect } from 'vitest'
import { useCheckoutForm } from '../useCheckoutForm'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Mock VeeValidate to avoid complex setup if possible, but integration testing with it is better.
// However, for unit tests, we want to check if it returns what we expect.
// Since useCheckoutForm uses `useForm` and `useField` internally, we need a component context or a setup function.

const TestComponent = defineComponent({
  setup() {
    return { ...useCheckoutForm() }
  },
  template: '<div></div>'
})

describe('useCheckoutForm', () => {
  it('initializes with empty values', () => {
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.fullName).toBe('')
    expect(wrapper.vm.address).toBe('')
    expect(wrapper.vm.phone).toBe('')
    expect(wrapper.vm.email).toBe('')
  })

  // Testing validation logic usually belongs to the schema tests,
  // but we can test if the composable exposes the errors and values correctly.
  // Since we are using `toTypedSchema(CheckoutSchema)`, we assume the schema is correct.
  // We can test if `onSubmit` is a function.

  it('exposes onSubmit function', () => {
    const wrapper = mount(TestComponent)
    expect(typeof wrapper.vm.onSubmit).toBe('function')
  })
})
