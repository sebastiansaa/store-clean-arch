import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Productscard from '../Productscard.vue'
import type { ProductInterface } from '../../interfaces'

describe('Productscard.vue', () => {
  const mockProduct: ProductInterface = {
    id: 1,
    title: 'Test Product',
    slug: 'test-product',
    price: 99.99,
    description: 'A great product',
    category: { id: 1, name: 'Electronics', image: 'img', slug: 'electronics', createdAt: '', updatedAt: '' },
    images: ['image1.jpg'],
    createdAt: '',
    updatedAt: ''
  }

  it('renders product information correctly', () => {
    const wrapper = mount(Productscard, {
      props: {
        product: mockProduct
      }
    })

    expect(wrapper.text()).toContain('Test Product')
    // Check if image is rendered (assuming it uses an img tag)
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('image1.jpg')
  })

  it('emits select event when clicked', async () => {
    const wrapper = mount(Productscard, {
      props: {
        product: mockProduct
      }
    })

    await wrapper.find('.product-card__content').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([mockProduct])
  })
})
