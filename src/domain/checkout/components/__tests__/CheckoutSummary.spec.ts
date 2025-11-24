import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckoutSummary from '../CheckoutSummary.vue'
import OrderSummary from '../../../cart-summary/components/OrderSummary.vue'

describe('CheckoutSummary.vue', () => {
  it('renders OrderSummary with correct props', () => {
    const items = [{ product: { id: 1, title: 'Item 1', price: 10 }, quantity: 1 }]
    const total = 10
    const wrapper = mount(CheckoutSummary, {
      props: { items, total }
    })

    const orderSummary = wrapper.findComponent(OrderSummary)
    expect(orderSummary.exists()).toBe(true)
    expect(orderSummary.props('items')).toEqual(items)
    expect(orderSummary.props('total')).toBe(total)
  })

  it('emits remove event when OrderSummary emits remove', async () => {
    const wrapper = mount(CheckoutSummary, {
      props: { items: [], total: 0 }
    })

    const orderSummary = wrapper.findComponent(OrderSummary)
    await orderSummary.vm.$emit('remove', 123)

    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')?.[0]).toEqual([123])
  })
})
