import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderCard from '../OrderCard.vue'
import type { Order } from '../../interfaces/types'
import { formatDate, getStatusLabel } from '../../helpers/formatters'
import { formatPrice } from '../../../../shared/helpers/formatPrice'

// Mock dependencies
vi.mock('../../helpers/formatters')
vi.mock('../../../../shared/helpers/formatPrice')

describe('OrderCard.vue', () => {
    const mockOrder: Order = {
        id: 'order-123',
        date: '2025-01-01T12:00:00Z',
        status: 'completed',
        items: [
            { id: 1, title: 'Product A', quantity: 2, price: 10, image: 'img-a.jpg' },
            { id: 2, title: 'Product B', quantity: 1, price: 20, image: 'img-b.jpg' },
        ],
        total: 40,
    }

    beforeEach(() => {
        vi.clearAllMocks()
        // Mock formatters to return predictable strings
        vi.mocked(formatDate).mockReturnValue('01 Jan 2025')
        vi.mocked(getStatusLabel).mockReturnValue('Completada')
        vi.mocked(formatPrice).mockImplementation((price) => `$${price}`)
    })

    it('renders order information correctly', () => {
        const wrapper = mount(OrderCard, { props: { order: mockOrder } })

        // ID and formatted date
        expect(wrapper.text()).toContain('order-123')
        expect(wrapper.text()).toContain('01 Jan 2025')

        // Status label and class
        const statusDiv = wrapper.find('.order-status')
        expect(statusDiv.text()).toBe('Completada')
        expect(statusDiv.classes()).toContain('completed')

        // Total
        expect(wrapper.text()).toContain('Total: $40')
    })

    it('renders each order item with title, quantity and formatted price', () => {
        const wrapper = mount(OrderCard, { props: { order: mockOrder } })
        const items = wrapper.findAll('.order-item')

        expect(items).toHaveLength(2)

        // First item
        expect(items[0].text()).toContain('Product A')
        expect(items[0].text()).toContain('Cantidad: 2')
        expect(items[0].text()).toContain('$20') // 2 * 10
        const imgA = items[0].find('img')
        expect(imgA.attributes('src')).toBe('img-a.jpg')
        expect(imgA.attributes('alt')).toBe('Product A')

        // Second item
        expect(items[1].text()).toContain('Product B')
        expect(items[1].text()).toContain('Cantidad: 1')
        expect(items[1].text()).toContain('$20') // 1 * 20
        const imgB = items[1].find('img')
        expect(imgB.attributes('src')).toBe('img-b.jpg')
        expect(imgB.attributes('alt')).toBe('Product B')
    })
})
