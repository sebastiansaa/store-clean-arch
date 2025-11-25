import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Productsgrid from '../Productsgrid.vue'
import Productscard from '../Productscard.vue'
import type { ProductInterface } from '../../interfaces'

describe('Productsgrid.vue', () => {
    const mockProducts: ProductInterface[] = [
        { id: 1, title: 'P1', slug: 'p1', price: 10, description: 'D1', category: { id: 1, name: 'C1', image: 'I1', slug: 'c1', createdAt: '', updatedAt: '' }, images: ['i1'], createdAt: '', updatedAt: '' },
        { id: 2, title: 'P2', slug: 'p2', price: 20, description: 'D2', category: { id: 1, name: 'C1', image: 'I1', slug: 'c1', createdAt: '', updatedAt: '' }, images: ['i2'], createdAt: '', updatedAt: '' }
    ]

    it('renders a list of products', () => {
        const wrapper = mount(Productsgrid, {
            props: {
                products: mockProducts
            },
            global: {
                components: {
                    Productscard
                },
                stubs: {
                    Productscard: true // Stub child component to focus on grid logic
                }
            }
        })

        expect(wrapper.findAllComponents({ name: 'Productscard' })).toHaveLength(2)
    })

    it('renders empty state if no products', () => {
        const wrapper = mount(Productsgrid, {
            props: {
                products: []
            }
        })

        expect(wrapper.findAllComponents({ name: 'Productscard' })).toHaveLength(0)
    })
})
