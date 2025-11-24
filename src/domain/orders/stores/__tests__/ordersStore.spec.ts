import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrdersStore } from '../ordersStore'
import { clearOrdersFromStorage } from '../../helpers/ordersPersistence'
import { logger } from '../../../../shared/services/logger'

vi.mock('../../helpers/ordersPersistence')
vi.mock('../../../../shared/services/logger')

describe('ordersStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('initializes with default values', () => {
        const store = useOrdersStore()
        expect(store.showSuccess).toBe(false)
    })

    it('setShowSuccess updates state', () => {
        const store = useOrdersStore()
        store.setShowSuccess(true)
        expect(store.showSuccess).toBe(true)
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('setShowSuccess: true'))
    })

    it('clearOrders calls persistence helper', () => {
        const store = useOrdersStore()
        store.clearOrders()
        expect(clearOrdersFromStorage).toHaveBeenCalled()
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('clearOrders'))
    })

    it('resetStore resets state', () => {
        const store = useOrdersStore()
        store.setShowSuccess(true)
        expect(store.showSuccess).toBe(true)

        store.resetStore()
        expect(store.showSuccess).toBe(false)
        expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('resetStore'))
    })
})
