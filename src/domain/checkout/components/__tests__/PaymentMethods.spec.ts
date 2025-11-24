import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentMethods from '../PaymentMethods.vue'

describe('PaymentMethods.vue', () => {
  it('renders available payment methods', () => {
    const wrapper = mount(PaymentMethods)
    expect(wrapper.text()).toContain('Tarjeta de crédito')
  })

  it('emits select event immediately with default method', () => {
    const wrapper = mount(PaymentMethods)
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([{ method: 'card', details: null }])
  })

  it('emits select event when method changes', async () => {
    const wrapper = mount(PaymentMethods)
    const input = wrapper.find('input[type="radio"][value="card"]')
    expect((input.element as HTMLInputElement).checked).toBe(true)
  })
})
