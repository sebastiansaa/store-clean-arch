import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadCartFromStorage, saveCartToStorage } from '../cartPersistence'
import type { CartItem } from '../../interface'

describe('cartPersistence', () => {
    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear()
        vi.clearAllMocks()
    })

    describe('loadCartFromStorage', () => {
        it('debe retornar un array vacío cuando no hay datos en localStorage', () => {
            const result = loadCartFromStorage()
            expect(result).toEqual([])
        })

        it('debe cargar correctamente los items del carrito desde localStorage', () => {
            const mockCart: CartItem[] = [
                {
                    product: {
                        id: 1,
                        title: 'Product 1',
                        price: 100,
                        description: 'Description',
                        images: [],
                        category: { id: 1, name: 'Category', image: '' },
                    },
                    quantity: 2,
                },
            ]

            localStorage.setItem('myapp_cart_v1', JSON.stringify(mockCart))
            const result = loadCartFromStorage()

            expect(result).toEqual(mockCart)
            expect(result).toHaveLength(1)
            expect(result[0].quantity).toBe(2)
        })

        it('debe retornar un array vacío si los datos en localStorage no son válidos', () => {
            localStorage.setItem('myapp_cart_v1', 'invalid json')
            const result = loadCartFromStorage()
            expect(result).toEqual([])
        })

        it('debe retornar un array vacío si los datos no son un array', () => {
            localStorage.setItem('myapp_cart_v1', JSON.stringify({ notAnArray: true }))
            const result = loadCartFromStorage()
            expect(result).toEqual([])
        })

        it('debe manejar errores de localStorage gracefully', () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
            const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('LocalStorage error')
            })

            const result = loadCartFromStorage()
            expect(result).toEqual([])

            consoleErrorSpy.mockRestore()
            getItemSpy.mockRestore()
        })
    })

    describe('saveCartToStorage', () => {
        it('debe guardar correctamente los items en localStorage', () => {
            const mockCart: CartItem[] = [
                {
                    product: {
                        id: 1,
                        title: 'Product 1',
                        price: 100,
                        description: 'Description',
                        images: [],
                        category: { id: 1, name: 'Category', image: '' },
                    },
                    quantity: 3,
                },
            ]

            saveCartToStorage(mockCart)

            const stored = localStorage.getItem('myapp_cart_v1')
            expect(stored).toBeTruthy()
            expect(JSON.parse(stored!)).toEqual(mockCart)
        })

        it('debe guardar un array vacío correctamente', () => {
            saveCartToStorage([])

            const stored = localStorage.getItem('myapp_cart_v1')
            expect(stored).toBe('[]')
        })

        it('debe manejar errores al guardar en localStorage', () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

            // Simular error en setItem
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('LocalStorage full')
            })

            // No debería lanzar error
            expect(() => saveCartToStorage([])).not.toThrow()

            consoleErrorSpy.mockRestore()
        })
    })
})
