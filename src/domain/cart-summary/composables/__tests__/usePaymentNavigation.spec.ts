import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePaymentNavigation } from '../usePaymentNavigation'
import { cartStore } from '../../../cart/stores/cartStore'
import type { ProductInterface } from '../../../products/interfaces'

// Mock del router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useRoute: () => ({
        query: {},
    }),
}))

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
vi.mock('@/domain/cart/helpers/cartPersistence', () => ({
    loadCartFromStorage: vi.fn(() => []),
    saveCartToStorage: vi.fn(),
}))

describe('usePaymentNavigation', () => {
    let cart: ReturnType<typeof cartStore>

    const mockProduct1: ProductInterface = {
        id: 1,
        title: 'Product 1',
        price: 50,
        description: 'Description 1',
        images: ['image1.jpg'],
        category: { id: 1, name: 'Electronics', image: 'cat.jpg', slug: 'electronics', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        slug: 'product-1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
    }

    const mockProduct2: ProductInterface = {
        id: 2,
        title: 'Product 2',
        price: 100,
        description: 'Description 2',
        images: ['image2.jpg'],
        category: { id: 2, name: 'Books', image: 'cat2.jpg', slug: 'books', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        slug: 'product-2',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
    }

    beforeEach(() => {
        setActivePinia(createPinia())
        cart = cartStore()
        mockPush.mockClear()
    })

    describe('Inicialización', () => {
        it('debe inicializar con productId null si no se proporciona', () => {
            const { productId } = usePaymentNavigation()
            expect(productId.value).toBeNull()
        })

        it('debe inicializar con productId proporcionado', () => {
            const { productId } = usePaymentNavigation(123)
            expect(productId.value).toBe(123)
        })

        it('debe tener canBeginPayment en false cuando el carrito está vacío', () => {
            const { canBeginPayment } = usePaymentNavigation()
            expect(canBeginPayment.value).toBe(false)
        })

        it('debe tener canBeginPayment en true cuando hay items en el carrito', () => {
            cart.addToCart(mockProduct1)
            const { canBeginPayment } = usePaymentNavigation()
            expect(canBeginPayment.value).toBe(true)
        })
    })

    describe('items computed', () => {
        it('debe retornar los items del carrito', () => {
            cart.addToCart(mockProduct1)
            cart.addToCart(mockProduct2)

            const { items } = usePaymentNavigation()
            expect(items.value).toHaveLength(2)
            expect(items.value[0].product.id).toBe(1)
            expect(items.value[1].product.id).toBe(2)
        })

        it('debe ser reactivo a cambios en el carrito', () => {
            const { items } = usePaymentNavigation()
            expect(items.value).toHaveLength(0)

            cart.addToCart(mockProduct1)
            expect(items.value).toHaveLength(1)
        })
    })

    describe('setProductId', () => {
        it('debe actualizar el productId con un número válido', () => {
            const { productId, setProductId } = usePaymentNavigation()

            setProductId(456)
            expect(productId.value).toBe(456)
        })

        it('debe establecer null si se pasa null', () => {
            const { productId, setProductId } = usePaymentNavigation(123)

            setProductId(null)
            expect(productId.value).toBeNull()
        })

        it('debe establecer null si se pasa undefined', () => {
            const { productId, setProductId } = usePaymentNavigation(123)

            setProductId(undefined)
            expect(productId.value).toBeNull()
        })
    })

    describe('resetProductId', () => {
        it('debe resetear el productId a null', () => {
            const { productId, resetProductId } = usePaymentNavigation(123)

            expect(productId.value).toBe(123)
            resetProductId()
            expect(productId.value).toBeNull()
        })
    })

    describe('productIdString', () => {
        it('debe retornar string vacío cuando productId es null', () => {
            const { productIdString } = usePaymentNavigation()
            expect(productIdString.value).toBe('')
        })

        it('debe retornar el productId como string', () => {
            const { productIdString } = usePaymentNavigation(789)
            expect(productIdString.value).toBe('789')
        })
    })

    describe('goToCheckout', () => {
        it('no debe navegar si el carrito está vacío', () => {
            const { goToCheckout } = usePaymentNavigation()

            goToCheckout()
            expect(mockPush).not.toHaveBeenCalled()
        })

        it('debe navegar a /checkout cuando hay items en el carrito', () => {
            cart.addToCart(mockProduct1)
            const { goToCheckout } = usePaymentNavigation()

            goToCheckout()
            expect(mockPush).toHaveBeenCalledWith({
                path: '/checkout',
                query: expect.any(Object)
            })
        })

        it('debe incluir productId en la query si está definido y existe en el carrito', () => {
            cart.addToCart(mockProduct1)
            const { goToCheckout } = usePaymentNavigation(1)

            goToCheckout()
            expect(mockPush).toHaveBeenCalledWith({
                path: '/checkout',
                query: expect.objectContaining({
                    productId: '1'
                })
            })
        })

        it('debe resetear productId si no existe en el carrito', () => {
            cart.addToCart(mockProduct1)
            const { goToCheckout, productId } = usePaymentNavigation(999)

            expect(productId.value).toBe(999)
            goToCheckout()
            expect(productId.value).toBeNull()
        })

        it('debe incluir returnTo en la query si se proporciona', () => {
            cart.addToCart(mockProduct1)
            const { goToCheckout } = usePaymentNavigation()

            goToCheckout({ returnTo: '/products' })
            expect(mockPush).toHaveBeenCalledWith({
                path: '/checkout',
                query: expect.objectContaining({
                    returnTo: '/products'
                })
            })
        })
    })
})
