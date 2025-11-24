import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentHeader from '../PaymentHeader.vue'

describe('PaymentHeader.vue', () => {
    describe('Renderizado', () => {
        it('debe renderizar correctamente', () => {
            const wrapper = mount(PaymentHeader)
            expect(wrapper.exists()).toBe(true)
        })

        it('debe mostrar el título por defecto "Pagar"', () => {
            const wrapper = mount(PaymentHeader)

            const h1 = wrapper.find('h1')
            expect(h1.exists()).toBe(true)
            expect(h1.text()).toBe('Pagar')
        })

        it('debe mostrar el título personalizado cuando se proporciona', () => {
            const wrapper = mount(PaymentHeader, {
                props: {
                    title: 'Confirmar Pedido'
                }
            })

            expect(wrapper.find('h1').text()).toBe('Confirmar Pedido')
        })

        it('debe tener la clase payment-header', () => {
            const wrapper = mount(PaymentHeader)

            expect(wrapper.find('.payment-header').exists()).toBe(true)
        })
    })

    describe('Props', () => {
        it('debe aceptar prop title como string', () => {
            const wrapper = mount(PaymentHeader, {
                props: {
                    title: 'Mi Título Personalizado'
                }
            })

            expect(wrapper.find('h1').text()).toBe('Mi Título Personalizado')
        })

        it('debe manejar títulos vacíos', () => {
            const wrapper = mount(PaymentHeader, {
                props: {
                    title: ''
                }
            })

            expect(wrapper.find('h1').text()).toBe('')
        })

        it('debe manejar títulos largos', () => {
            const longTitle = 'Este es un título muy largo para probar que el componente puede manejar textos extensos sin problemas'
            const wrapper = mount(PaymentHeader, {
                props: {
                    title: longTitle
                }
            })

            expect(wrapper.find('h1').text()).toBe(longTitle)
        })
    })

    describe('Estructura HTML', () => {
        it('debe tener un header como elemento raíz', () => {
            const wrapper = mount(PaymentHeader)

            expect(wrapper.element.tagName).toBe('HEADER')
        })

        it('debe contener exactamente un h1', () => {
            const wrapper = mount(PaymentHeader)

            const h1Elements = wrapper.findAll('h1')
            expect(h1Elements).toHaveLength(1)
        })
    })
})
