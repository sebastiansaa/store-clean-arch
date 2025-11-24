import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OrdersListView from '../OrdersListView.vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '../../stores/ordersStore'
import { useOrders } from '../../composables/useOrders'
import { ref } from 'vue'

// Mock dependencies
vi.mock('vue-router')
vi.mock('../../stores/ordersStore')
vi.mock('../../composables/useOrders')

describe('OrdersListView.vue', () => {
  const mockRefetch = vi.fn()
  const mockWatchSuccess = vi.fn()
  const mockSetShowSuccess = vi.fn()
  const mockOrders = ref([])

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useRoute
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as any)

    // Mock useOrdersStore
    vi.mocked(useOrdersStore).mockReturnValue({
      showSuccess: false,
      setShowSuccess: mockSetShowSuccess
    } as any)

    // Mock useOrders
    vi.mocked(useOrders).mockReturnValue({
      orders: mockOrders,
      refetch: mockRefetch,
      watchSuccess: mockWatchSuccess
    } as any)
  })

  it('fetches orders on mount', () => {
    mount(OrdersListView, {
      global: {
        stubs: {
          OrdersList: true
        }
      }
    })
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('handles success query param correctly', () => {
    vi.mocked(useRoute).mockReturnValue({
      query: { success: 'true' }
    } as any)

    mount(OrdersListView, {
      global: {
        stubs: {
          OrdersList: true
        }
      }
    })

    expect(mockSetShowSuccess).toHaveBeenCalledWith(true)
    expect(mockWatchSuccess).toHaveBeenCalled()
  })

  it('does not set success if query param is missing', () => {
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as any)

    mount(OrdersListView, {
      global: {
        stubs: {
          OrdersList: true
        }
      }
    })

    expect(mockSetShowSuccess).not.toHaveBeenCalled()
    expect(mockWatchSuccess).not.toHaveBeenCalled()
  })

  it('passes props to OrdersList', () => {
    const wrapper = mount(OrdersListView, {
      global: {
        stubs: {
          OrdersList: true
        }
      }
    })

    const ordersList = wrapper.findComponent({ name: 'OrdersList' })
    expect(ordersList.exists()).toBe(true)
    expect(ordersList.props('orders')).toEqual(mockOrders.value)
    expect(ordersList.props('showSuccess')).toBe(false)
  })
})
