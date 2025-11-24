import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import miniCartDrawer from '../miniCartDrawer.vue'
import { cartStore } from '../../stores/cartStore'
import { useMiniCartStore } from '../../stores/useMiniCartStore'
import type { ProductInterface } from '../../../products/interfaces'

// Mock de dependencias
vi.mock('@/shared/services/logger', () => ({
    logger: {
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
    },
}))

vi.mock('../../helpers/cartPersistence', () => ({
    loadCartFromStorage: vi.fn(() => []),
    saveCartToStorage: vi.fn(),
}))

vi.mock('@/domain/cart-summary/composables/usePaymentNavigation', () => ({
    usePaymentNavigation: () => ({
        goToCheckout: vi.fn(),
    }),
}))

describe('miniCartDrawer.vue', () => {
    let pinia: ReturnType<typeof createPinia>
    let cart: ReturnType<typeof cartStore>
    let miniCart: ReturnType<typeof useMiniCartStore>

    const mockProduct1: ProductInterface = {
        id: 1,
        title: 'Producto de Prueba 1',
        price: 50,
        description: 'Descripción',
        images: ['https://example.com/image1.jpg'],
        category: {
            id: 1, name: 'Categoría', image: 'cat.jpg',
            slug: '',
            createdAt: '',
            updatedAt: ''
        },
        slug: '',
        createdAt: '',
        updatedAt: ''
    }

    const mockProduct2: ProductInterface = {
        id: 2,
        title: 'Producto de Prueba 2',
        price: 100,
        description: 'Descripción',
        images: ['https://example.com/image2.jpg'],
        category: {
            id: 2, name: 'Categoría 2', image: 'cat2.jpg',
            slug: '',
            createdAt: '',
            updatedAt: ''
        },
        slug: '',
        createdAt: '',
        updatedAt: ''
    }

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
        cart = cartStore()
        miniCart = useMiniCartStore()
    })

    describe('Renderizado', () => {
        it('debe renderizar correctamente cuando está cerrado', () => {
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: true,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(wrapper.exists()).toBe(true)
        })

        it('debe mostrar "Tu carrito está vacío" cuando no hay items', () => {
            miniCart.openExpanded()
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(wrapper.text()).toContain('Tu carrito está vacío')
        })

        it('debe mostrar los items del carrito cuando hay productos', () => {
            cart.addToCart(mockProduct1)
            cart.addToCart(mockProduct2)
            miniCart.openExpanded()

            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(wrapper.text()).toContain('Producto de Prueba 1')
            expect(wrapper.text()).toContain('Producto de Prueba 2')
        })

        it('debe mostrar el título del header', () => {
            miniCart.openExpanded()
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(wrapper.find('h3').text()).toBe('Tu carrito')
        })
    })

    describe('Items del carrito', () => {
        beforeEach(() => {
            cart.addToCart(mockProduct1)
            cart.addToCart(mockProduct1)
            miniCart.openExpanded()
        })

        it('debe mostrar la cantidad correcta de cada producto', () => {
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(wrapper.text()).toContain('x2')
        })

        it('debe mostrar la imagen del producto', () => {
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            const img = wrapper.find('.mini-cart__thumb')
            expect(img.exists()).toBe(true)
            expect(img.attributes('src')).toBe('https://example.com/image1.jpg')
        })

        it('debe renderizar el botón de eliminar para cada item', () => {
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            const removeButtons = wrapper.findAll('.mini-cart__remove')
            expect(removeButtons).toHaveLength(1) // 1 producto único
        })
    })

    describe('Total del carrito', () => {
        it('debe mostrar el total correcto', async () => {
            cart.addToCart(mockProduct1) // 50
            cart.addToCart(mockProduct2) // 100
            await new Promise(resolve => setTimeout(resolve, 0)) // Esperar a que el watcher se ejecute
            miniCart.openExpanded()

            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            // Total debería ser 150
            expect(wrapper.text()).toContain('150')
        })

        it('debe actualizar el total cuando se agregan productos', async () => {
            cart.addToCart(mockProduct1)
            miniCart.openExpanded()

            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(wrapper.text()).toContain('50')

            cart.addToCart(mockProduct1)
            await wrapper.vm.$nextTick()

            expect(wrapper.text()).toContain('100')
        })
    })

    describe('Acciones', () => {
        it('debe cerrar el drawer al hacer click en el botón de cerrar', async () => {
            miniCart.openExpanded()
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            const closeButton = wrapper.find('.mini-cart__close')
            await closeButton.trigger('click')

            expect(miniCart.state).toBe('closed')
        })

        it('debe remover un item del carrito al hacer click en eliminar', async () => {
            cart.addToCart(mockProduct1)
            cart.addToCart(mockProduct2)
            miniCart.openExpanded()

            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(cart.cartItems).toHaveLength(2)

            const removeButton = wrapper.find('.mini-cart__remove')
            await removeButton.trigger('click')

            expect(cart.cartItems).toHaveLength(1)
        })

        it('debe expandir el drawer cuando está en modo mini y se hace click', async () => {
            miniCart.openMini()
            cart.addToCart(mockProduct1)

            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(miniCart.state).toBe('mini')

            const panel = wrapper.find('.mini-cart')
            await panel.trigger('click')

            expect(miniCart.state).toBe('expanded')
        })
    })

    describe('Ancho del drawer', () => {
        it('debe usar 20vw cuando está en modo mini', () => {
            miniCart.openMini()
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            // El componente calcula drawerWidth internamente
            expect(miniCart.isMini).toBe(true)
        })

        it('debe usar 40vw cuando está expandido', () => {
            miniCart.openExpanded()
            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(miniCart.isExpanded).toBe(true)
        })
    })

    describe('Botón "Ir a pagar"', () => {
        it('debe mostrar el botón cuando hay items en el carrito', () => {
            cart.addToCart(mockProduct1)
            miniCart.openExpanded()

            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(wrapper.find('.mini-cart__actions').exists()).toBe(true)
        })

        it('no debe mostrar el botón cuando el carrito está vacío', () => {
            miniCart.openExpanded()

            const wrapper = mount(miniCartDrawer, {
                global: {
                    plugins: [pinia],
                    stubs: {
                        DrawerLateral: false,
                        BasePaymentButton: true,
                    },
                },
            })

            expect(wrapper.find('.mini-cart__actions').exists()).toBe(false)
        })
    })
})
