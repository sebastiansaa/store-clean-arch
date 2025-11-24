import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { useOrders } from '../useOrders'
import { useOrdersStore } from '../../stores/ordersStore'
import { logger } from '../../../../shared/services/logger'
import type { Order } from '../../interfaces/types'

// Mock dependencies
vi.mock('../../stores/ordersStore')
vi.mock('../../helpers/ordersPersistence')
vi.mock('../../../../shared/services/logger')

// Mock Vue Query
const mockRefetch = vi.fn()
const mockQueryData = ref<Order[]>([])
const mockQueryIsLoading = ref(false)
const mockQueryIsError = ref(false)
const mockQueryError = ref<Error | null>(null)

vi.mock('@tanstack/vue-query', () => ({
    useQuery: vi.fn(() => ({
        data: mockQueryData,
        isLoading: mockQueryIsLoading,
        isError: mockQueryIsError,
        error: mockQueryError,
        refetch: mockRefetch,
    })),
}))

// Mock VueUse
const mockStartTimer = vi.fn()
vi.mock('@vueuse/core', () => ({
    useTimeoutFn: vi.fn((cb) => {
        // Store callback if needed for testing execution, but here we just mock start
        return { start: mockStartTimer }
    }),
}))

describe('useOrders composable', () => {
    // Mock Store
    const mockSetShowSuccess = vi.fn()
    const mockClearOrdersStore = vi.fn()
    const mockShowSuccess = ref(false)

    beforeEach(() => {
        vi.clearAllMocks()

        // Reset refs
        mockQueryData.value = []
        mockQueryIsLoading.value = false
        mockQueryIsError.value = false
        mockQueryError.value = null
        mockShowSuccess.value = false

        // Setup Store Mock
        vi.mocked(useOrdersStore).mockReturnValue({
            get showSuccess() { return mockShowSuccess.value },
            setShowSuccess: mockSetShowSuccess,
            clearOrders: mockClearOrdersStore,
            resetStore: vi.fn(),
        } as any)
    })

    it('initializes with correct default values', () => {
        const { orders, isLoading, isError, error } = useOrders()

        expect(orders.value).toEqual([])
        expect(isLoading.value).toBe(false)
        expect(isError.value).toBe(false)
        expect(error.value).toBe(null)
    })

    it('returns orders from query', () => {
        const mockOrdersList: Order[] = [
            { id: '1', date: '2025-01-01', status: 'completed', items: [], total: 100 }
        ]
        mockQueryData.value = mockOrdersList

        const { orders } = useOrders()
        expect(orders.value).toEqual(mockOrdersList)
    })

    it('watchSuccess starts timer if showSuccess is true', () => {
        mockShowSuccess.value = true
        const { watchSuccess } = useOrders()

        watchSuccess()

        expect(mockStartTimer).toHaveBeenCalled()
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Starting success message timer'))
    })

    it('watchSuccess does nothing if showSuccess is false', () => {
        mockShowSuccess.value = false
        const { watchSuccess } = useOrders()

        watchSuccess()

        expect(mockStartTimer).not.toHaveBeenCalled()
    })

    it('clearHistory clears store and refetches query', () => {
        const { clearHistory } = useOrders()

        clearHistory()

        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Clearing order history'))
        expect(mockClearOrdersStore).toHaveBeenCalled()
        expect(mockRefetch).toHaveBeenCalled()
    })
})

