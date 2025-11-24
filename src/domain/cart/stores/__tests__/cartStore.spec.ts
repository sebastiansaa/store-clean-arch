import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { cartStore } from '../cartStore'
import type { ProductInterface } from '../../../products/interfaces'
import * as cartPersistence from '../../helpers/cartPersistence'

// Mock del logger
vi.mock('@/shared/services/logger', () => ({
    logger: {
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
    },
}))

// Mock de cartPersistence
vi.mock('../../helpers/cartPersistence', () => ({
    loadCartFromStorage: vi.fn(() => []),
    saveCartToStorage: vi.fn(),
}))

describe('cartStore', () => {
    let store: ReturnType<typeof cartStore>

    const mockProduct1: ProductInterface = {
        id: 1,
        title: 'Product 1',
        price: 50,
        description: 'Description 1',
        images: ['image1.jpg'],
        category: { id: 1, name: 'Electronics', image: 'cat.jpg', slug: 'electronics', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        slug: '',
        createdAt: '',
        updatedAt: ''
    }

    const mockProduct2: ProductInterface = {
        id: 2,
        title: 'Product 2',
        price: 100,
        description: 'Description 2',
        images: ['image2.jpg'],
        category: { id: 2, name: 'Books', image: 'cat2.jpg', slug: 'books', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        slug: '',
        createdAt: '',
        updatedAt: ''
    }

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        localStorage.clear()
        // Asegurar que loadCartFromStorage devuelva array vacío por defecto
        vi.mocked(cartPersistence.loadCartFromStorage).mockReturnValue([])
        store = cartStore()
    })

    describe('Estado inicial', () => {
        it('debe inicializar con un carrito vacío', () => {
            expect(store.cartItems).toEqual([])
            expect(store.totalPrice).toBe(0)
            expect(store.count).toBe(0)
        })

        it('debe cargar items del storage al inicializar', () => {
            const mockCartItems = [
                { product: mockProduct1, quantity: 2 },
            ]

            vi.mocked(cartPersistence.loadCartFromStorage).mockReturnValue(mockCartItems)

            // Recrear store para que cargue los datos mockeados
            setActivePinia(createPinia())
            const newStore = cartStore()

            expect(newStore.cartItems).toHaveLength(1)
        })
    })

    describe('addToCart', () => {
        it('debe agregar un nuevo producto al carrito', () => {
            store.addToCart(mockProduct1)

            expect(store.cartItems).toHaveLength(1)
            expect(store.cartItems[0].product.id).toBe(1)
            expect(store.cartItems[0].quantity).toBe(1)
        })

        it('debe incrementar la cantidad si el producto ya existe en el carrito', () => {
            store.addToCart(mockProduct1)
            store.addToCart(mockProduct1)

            expect(store.cartItems).toHaveLength(1)
            expect(store.cartItems[0].quantity).toBe(2)
        })

        it('debe agregar múltiples productos diferentes', () => {
            store.addToCart(mockProduct1)
            store.addToCart(mockProduct2)

            expect(store.cartItems).toHaveLength(2)
            expect(store.cartItems[0].product.id).toBe(1)
            expect(store.cartItems[1].product.id).toBe(2)
        })

        it('debe actualizar el total del carrito después de agregar productos', async () => {
            store.addToCart(mockProduct1) // 50
            await nextTick()
            expect(store.totalPrice).toBe(50)

            store.addToCart(mockProduct1) // 50 x 2 = 100
            await nextTick()
            expect(store.totalPrice).toBe(100)

            store.addToCart(mockProduct2) // 100 + 100 = 200
            await nextTick()
            expect(store.totalPrice).toBe(200)
        })

        it('debe llamar a saveCartToStorage después de agregar un producto', async () => {
            store.addToCart(mockProduct1)

            // Esperar a que se ejecute el watcher
            await nextTick()

            expect(cartPersistence.saveCartToStorage).toHaveBeenCalled()
        })
    })

    describe('removeFromCart', () => {
        beforeEach(async () => {
            store.addToCart(mockProduct1)
            store.addToCart(mockProduct2)
            await nextTick()
        })

        it('debe remover un producto del carrito por ID', () => {
            expect(store.cartItems).toHaveLength(2)

            store.removeFromCart(1)

            expect(store.cartItems).toHaveLength(1)
            expect(store.cartItems[0].product.id).toBe(2)
        })

        it('no debe hacer nada si el ID no existe', () => {
            const initialLength = store.cartItems.length
            store.removeFromCart(999)

            expect(store.cartItems).toHaveLength(initialLength)
        })

        it('debe actualizar el total después de remover un producto', async () => {
            const totalBeforeRemove = store.totalPrice
            store.removeFromCart(1) // Remover product1 (50)
            await nextTick()

            expect(store.totalPrice).toBe(totalBeforeRemove - mockProduct1.price)
        })

        it('debe llamar a saveCartToStorage después de remover', async () => {
            vi.clearAllMocks()
            store.removeFromCart(1)

            await nextTick()

            expect(cartPersistence.saveCartToStorage).toHaveBeenCalled()
        })
    })

    describe('updateQuantity', () => {
        beforeEach(async () => {
            store.addToCart(mockProduct1)
            await nextTick()
        })

        it('debe actualizar la cantidad de un producto', async () => {
            store.updateQuantity(1, 5)
            await nextTick()

            expect(store.cartItems[0].quantity).toBe(5)
            expect(store.totalPrice).toBe(mockProduct1.price * 5)
        })

        it('debe remover el producto si la cantidad es 0', () => {
            store.updateQuantity(1, 0)

            expect(store.cartItems).toHaveLength(0)
        })

        it('debe prevenir cantidades negativas', () => {
            store.updateQuantity(1, -5)

            expect(store.cartItems).toHaveLength(0) // Debe removerse
        })

        it('debe convertir cantidades decimales a enteros', () => {
            store.updateQuantity(1, 3.7)

            expect(store.cartItems[0].quantity).toBe(3)
        })

        it('no debe hacer nada si el producto no existe', () => {
            const initialState = [...store.cartItems]
            store.updateQuantity(999, 10)

            expect(store.cartItems).toEqual(initialState)
        })
    })

    describe('clearCart', () => {
        beforeEach(async () => {
            store.addToCart(mockProduct1)
            store.addToCart(mockProduct2)
            await nextTick()
        })

        it('debe vaciar completamente el carrito', async () => {
            expect(store.cartItems).toHaveLength(2)

            store.clearCart()
            await nextTick()

            expect(store.cartItems).toEqual([])
            expect(store.totalPrice).toBe(0)
            expect(store.count).toBe(0)
        })

        it('debe llamar a saveCartToStorage con array vacío', async () => {
            vi.clearAllMocks()
            store.clearCart()

            await nextTick()

            expect(cartPersistence.saveCartToStorage).toHaveBeenCalledWith([])
        })
    })

    describe('Getters computados', () => {
        beforeEach(async () => {
            store.addToCart(mockProduct1)
            store.addToCart(mockProduct1)
            store.addToCart(mockProduct2)
            await nextTick()
        })

        it('count debe retornar la cantidad total de items', () => {
            expect(store.count).toBe(3) // 2 del product1 + 1 del product2
        })

        it('totalPrice debe calcular correctamente el precio total', () => {
            const expected = mockProduct1.price * 2 + mockProduct2.price * 1
            expect(store.totalPrice).toBe(expected)
        })

        it('cartItems debe retornar todos los items', () => {
            expect(store.cartItems).toHaveLength(2)
        })
    })

    describe('Persistencia automática', () => {
        it('debe guardar automáticamente cuando cambia el carrito', async () => {
            vi.clearAllMocks()

            store.addToCart(mockProduct1)
            await nextTick()

            expect(cartPersistence.saveCartToStorage).toHaveBeenCalledTimes(1)

            store.updateQuantity(1, 3)
            await nextTick()

            expect(cartPersistence.saveCartToStorage).toHaveBeenCalledTimes(2)
        })
    })
})
