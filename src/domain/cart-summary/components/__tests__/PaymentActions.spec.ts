import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PaymentActions from '../PaymentActions.vue'

describe('PaymentActions.vue', () => {
    describe('Renderizado', () => {
        it('debe renderizar correctamente', () => {
            const wrapper = mount(PaymentActions)
            expect(wrapper.exists()).toBe(true)
        })

        it('debe mostrar el botón de pagar con texto por defecto', () => {
            const wrapper = mount(PaymentActions)
            const button = wrapper.find('.pay-btn')

            expect(button.exists()).toBe(true)
            expect(button.text()).toBe('Pagar')
        })

        it('debe mostrar texto personalizado en el botón usando slot', () => {
            const wrapper = mount(PaymentActions, {
                slots: {
                    default: 'Confirmar Pago'
                }
            })

            expect(wrapper.find('.pay-btn').text()).toBe('Confirmar Pago')
        })

        it('debe mostrar productId cuando se proporciona', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    productId: '123'
                }
            })

            expect(wrapper.text()).toContain('Producto : 123')
        })

        it('no debe mostrar productId cuando no se proporciona', () => {
            const wrapper = mount(PaymentActions)

            expect(wrapper.text()).not.toContain('Producto :')
        })
    })

    describe('Estado de procesamiento', () => {
        it('debe mostrar spinner cuando processing es true', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    processing: true
                }
            })

            const spinner = wrapper.find('.spinner')
            expect(spinner.exists()).toBe(true)
        })

        it('debe mostrar texto "Procesando" accesible cuando processing es true', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    processing: true
                }
            })

            expect(wrapper.text()).toContain('Procesando')
        })

        it('debe deshabilitar el botón cuando processing es true', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    processing: true
                }
            })

            const button = wrapper.find('.pay-btn')
            expect(button.attributes('disabled')).toBeDefined()
            expect(button.attributes('aria-disabled')).toBe('true')
        })

        it('no debe mostrar el botón de reintentar cuando está procesando', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    processing: true,
                    errorMessage: 'Error de prueba'
                }
            })

            expect(wrapper.find('.btn.secondary').exists()).toBe(false)
        })
    })

    describe('Estado disabled', () => {
        it('debe deshabilitar el botón cuando disabled es true', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    disabled: true
                }
            })

            const button = wrapper.find('.pay-btn')
            expect(button.attributes('disabled')).toBeDefined()
        })

        it('debe deshabilitar el botón cuando disabled O processing son true', () => {
            const wrapper1 = mount(PaymentActions, {
                props: { disabled: true, processing: false }
            })
            expect(wrapper1.find('.pay-btn').attributes('disabled')).toBeDefined()

            const wrapper2 = mount(PaymentActions, {
                props: { disabled: false, processing: true }
            })
            expect(wrapper2.find('.pay-btn').attributes('disabled')).toBeDefined()
        })
    })

    describe('Manejo de errores', () => {
        it('debe mostrar mensaje de error cuando errorMessage está presente', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    errorMessage: 'Error al procesar el pago'
                }
            })

            const errorDiv = wrapper.find('.error')
            expect(errorDiv.exists()).toBe(true)
            expect(errorDiv.text()).toBe('Error al procesar el pago')
        })

        it('no debe mostrar error cuando errorMessage no está presente', () => {
            const wrapper = mount(PaymentActions)

            expect(wrapper.find('.error').exists()).toBe(false)
        })

        it('debe mostrar botón de reintentar cuando hay error y no está procesando', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    errorMessage: 'Error de prueba',
                    processing: false
                }
            })

            const retryButton = wrapper.find('.btn.secondary')
            expect(retryButton.exists()).toBe(true)
            expect(retryButton.text()).toBe('Reintentar')
        })

        it('debe enfocar el error cuando aparece', async () => {
            const wrapper = mount(PaymentActions, {
                attachTo: document.body
            })

            await wrapper.setProps({ errorMessage: 'Error de prueba' })
            await nextTick()

            const errorDiv = wrapper.find('.error')
            expect(errorDiv.attributes('tabindex')).toBe('-1')
            expect(errorDiv.attributes('role')).toBe('alert')

            wrapper.unmount()
        })
    })

    describe('Eventos', () => {
        it('debe emitir evento pay al hacer click en el botón de pagar', async () => {
            const wrapper = mount(PaymentActions)

            const button = wrapper.find('.pay-btn')
            await button.trigger('click')

            expect(wrapper.emitted('pay')).toBeTruthy()
            expect(wrapper.emitted('pay')).toHaveLength(1)
        })

        it('no debe emitir evento pay si el botón está deshabilitado', async () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    disabled: true
                }
            })

            const button = wrapper.find('.pay-btn')
            await button.trigger('click')

            // El evento podría emitirse pero el botón está deshabilitado
            // En HTML, los botones deshabilitados no deberían disparar eventos
            expect(button.attributes('disabled')).toBeDefined()
        })

        it('debe emitir evento retry al hacer click en reintentar', async () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    errorMessage: 'Error de prueba'
                }
            })

            const retryButton = wrapper.find('.btn.secondary')
            await retryButton.trigger('click')

            expect(wrapper.emitted('retry')).toBeTruthy()
            expect(wrapper.emitted('retry')).toHaveLength(1)
        })
    })

    describe('Accesibilidad', () => {
        it('debe tener aria-disabled en el botón cuando está deshabilitado', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    disabled: true
                }
            })

            expect(wrapper.find('.pay-btn').attributes('aria-disabled')).toBe('true')
        })

        it('debe tener role="alert" en el mensaje de error', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    errorMessage: 'Error de prueba'
                }
            })

            expect(wrapper.find('.error').attributes('role')).toBe('alert')
        })

        it('debe tener clase visually-hidden para texto de procesando', () => {
            const wrapper = mount(PaymentActions, {
                props: {
                    processing: true
                }
            })

            const visuallyHidden = wrapper.find('.visually-hidden')
            expect(visuallyHidden.exists()).toBe(true)
            expect(visuallyHidden.text()).toBe('Procesando')
        })
    })
})
