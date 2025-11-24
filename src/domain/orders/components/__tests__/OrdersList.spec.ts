import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OrdersList from '../OrdersList.vue'
import OrderCard from '../OrderCard.vue'
import type { Order } from '../../interfaces/types'
import { formatDate, getStatusLabel } from '../../helpers/formatters'

// Mock dependencies
vi.mock('../../helpers/formatters')

describe('OrdersList.vue', () => {
    const mockOrders: Order[] = [
        {
            id: 'order-1',
            date: '2025-01-01T12:00:00Z',
            status: 'completed',
            items: [],
            total: 100,
        },
        {
            id: 'order-2',
            date: '2025-02-01T12:00:00Z',
            status: 'pending',
            items: [],
            total: 50,
        },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(formatDate).mockReturnValue('01 Jan 2025')
        vi.mocked(getStatusLabel).mockReturnValue('Completada')
    })

    it('shows empty state when no orders', () => {
        const wrapper = mount(OrdersList, {
            props: { orders: [], showSuccess: false },
            global: {
                stubs: {
                    RouterLink: true
                }
            }
        })
        expect(wrapper.find('.empty-state').exists()).toBe(true)
        expect(wrapper.text()).toContain('No tienes órdenes todavía')
    })

    it('renders a list of OrderCard components when orders exist', () => {
        const wrapper = mount(OrdersList, {
            props: { orders: mockOrders, showSuccess: false },
            global: {
                stubs: {
                    OrderCard: true,
                    RouterLink: true
                }
            }
        })

        const cards = wrapper.findAllComponents(OrderCard)
        expect(cards).toHaveLength(2)
        expect(cards[0].props('order')).toEqual(mockOrders[0])
        expect(cards[1].props('order')).toEqual(mockOrders[1])
    })

    it('displays success banner when showSuccess is true', () => {
        const wrapper = mount(OrdersList, {
            props: { orders: mockOrders, showSuccess: true },
            global: {
                stubs: {
                    OrderCard: true,
                    RouterLink: true
                }
            }
        })
        expect(wrapper.find('.success-message').exists()).toBe(true)
        expect(wrapper.text()).toContain('¡Pago realizado con éxito!')
    })
})
