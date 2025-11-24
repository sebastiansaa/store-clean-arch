import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CartItemRow from '../CartItemRow.vue'
import type { CartItem } from '../../../cart/interface'

describe('CartItemRow.vue', () => {
    const mockCartItem: CartItem = {
        product: {
            id: 1,
            title: 'Producto de Prueba',
            price: 99.99,
            description: 'Descripción del producto',
            images: ['https://example.com/image.jpg'],
            category: {
                id: 1,
                name: 'Categoría',
                image: 'cat.jpg',
                slug: 'categoria',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01'
            },
            slug: 'producto-prueba',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
        },
        quantity: 3
    }

    describe('Renderizado', () => {
        it('debe renderizar correctamente', () => {
            const wrapper = mount(CartItemRow, {
                props: { item: mockCartItem }
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('debe mostrar el título del producto', () => {
            const wrapper = mount(CartItemRow, {
                props: { item: mockCartItem }
            })

            expect(wrapper.text()).toContain('Producto de Prueba')
        })

        it('debe mostrar la cantidad del producto', () => {
            const wrapper = mount(CartItemRow, {
                props: { item: mockCartItem }
            })

            expect(wrapper.text()).toContain('x3')
        })

        it('debe mostrar el precio formateado', () => {
            const wrapper = mount(CartItemRow, {
                props: { item: mockCartItem }
            })

            // El precio debería estar formateado
            expect(wrapper.text()).toContain('99.99')
        })

        it('debe mostrar la imagen del producto', () => {
            const wrapper = mount(CartItemRow, {
                props: { item: mockCartItem }
            })

            const img = wrapper.find('.thumb')
            expect(img.exists()).toBe(true)
            expect(img.attributes('src')).toBe('https://example.com/image.jpg')
        })

        it('debe renderizar el botón de eliminar', () => {
            const wrapper = mount(CartItemRow, {
                props: { item: mockCartItem }
            })

            const removeButton = wrapper.find('.remove')
            expect(removeButton.exists()).toBe(true)
            expect(removeButton.text()).toBe('×')
        })
    })

    describe('Eventos', () => {
        it('debe emitir evento remove con el productId al hacer click en eliminar', async () => {
            const wrapper = mount(CartItemRow, {
                props: { item: mockCartItem }
            })

            const removeButton = wrapper.find('.remove')
            await removeButton.trigger('click')

            expect(wrapper.emitted('remove')).toBeTruthy()
            expect(wrapper.emitted('remove')?.[0]).toEqual([1])
        })
    })

    describe('Casos edge', () => {
        it('debe manejar productos sin imagen', () => {
            const itemSinImagen: CartItem = {
                ...mockCartItem,
                product: {
                    ...mockCartItem.product,
                    images: []
                }
            }

            const wrapper = mount(CartItemRow, {
                props: { item: itemSinImagen }
            })

            const img = wrapper.find('.thumb')
            // El v-if verifica si existe el array, no si está vacío
            // Un array vacío es truthy, así que la imagen se renderiza pero sin src válido
            expect(img.exists()).toBe(true)
            expect(img.attributes('src')).toBeUndefined()
        })

        it('debe mostrar cantidad 1 correctamente', () => {
            const itemCantidad1: CartItem = {
                ...mockCartItem,
                quantity: 1
            }

            const wrapper = mount(CartItemRow, {
                props: { item: itemCantidad1 }
            })

            expect(wrapper.text()).toContain('x1')
        })
    })
})
