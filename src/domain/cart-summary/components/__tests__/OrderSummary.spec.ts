import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderSummary from '../OrderSummary.vue'
import CartItemRow from '../CartItemRow.vue'
import type { CartItem } from '../../../cart/interface'

describe('OrderSummary.vue', () => {
    const mockCartItems: CartItem[] = [
        {
            product: {
                id: 1,
                title: 'Producto 1',
                price: 50,
                description: 'Descripción 1',
                images: ['https://example.com/image1.jpg'],
                category: {
                    id: 1,
                    name: 'Categoría 1',
                    image: 'cat1.jpg',
                    slug: 'categoria-1',
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01'
                },
                slug: 'producto-1',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01'
            },
            quantity: 2
        },
        {
            product: {
                id: 2,
                title: 'Producto 2',
                price: 100,
                description: 'Descripción 2',
                images: ['https://example.com/image2.jpg'],
                category: {
                    id: 2,
                    name: 'Categoría 2',
                    image: 'cat2.jpg',
                    slug: 'categoria-2',
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01'
                },
                slug: 'producto-2',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01'
            },
            quantity: 1
        }
    ]

    describe('Renderizado', () => {
        it('debe renderizar correctamente', () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: mockCartItems,
                    total: 200
                }
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('debe mostrar el título "Resumen del pedido"', () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: mockCartItems,
                    total: 200
                }
            })

            expect(wrapper.find('h2').text()).toBe('Resumen del pedido')
        })

        it('debe mostrar mensaje de carrito vacío cuando no hay items', () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: [],
                    total: 0
                }
            })

            expect(wrapper.text()).toContain('Tu carrito está vacío')
        })

        it('debe renderizar CartItemRow para cada item', () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: mockCartItems,
                    total: 200
                }
            })

            const cartItemRows = wrapper.findAllComponents(CartItemRow)
            expect(cartItemRows).toHaveLength(2)
        })

        it('debe mostrar el total formateado', () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: mockCartItems,
                    total: 200
                }
            })

            expect(wrapper.text()).toContain('Total:')
            expect(wrapper.text()).toContain('200')
        })
    })

    describe('Eventos', () => {
        it('debe emitir evento remove cuando CartItemRow emite remove', async () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: mockCartItems,
                    total: 200
                }
            })

            const firstCartItemRow = wrapper.findComponent(CartItemRow)
            await firstCartItemRow.vm.$emit('remove', 1)

            expect(wrapper.emitted('remove')).toBeTruthy()
            expect(wrapper.emitted('remove')?.[0]).toEqual([1])
        })
    })

    describe('Casos edge', () => {
        it('debe manejar total 0', () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: [],
                    total: 0
                }
            })

            expect(wrapper.text()).toContain('0')
        })

        it('debe manejar un solo item', () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: [mockCartItems[0]],
                    total: 100
                }
            })

            const cartItemRows = wrapper.findAllComponents(CartItemRow)
            expect(cartItemRows).toHaveLength(1)
        })

        it('debe renderizar correctamente con totales grandes', () => {
            const wrapper = mount(OrderSummary, {
                props: {
                    items: mockCartItems,
                    total: 999999.99
                }
            })

            // formatPrice usa Intl.NumberFormat que agrega comas
            expect(wrapper.text()).toContain('999,999.99')
        })
    })
})
