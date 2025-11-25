import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProductById } from '../useProductById'
import { ref } from 'vue'

// Mock dependencies
vi.mock('../../services')
vi.mock('@tanstack/vue-query', () => ({
    useQuery: vi.fn()
}))

import { useQuery } from '@tanstack/vue-query'

describe('useProductById', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('initializes correctly with number id', () => {
        vi.mocked(useQuery).mockReturnValue({
            data: ref(null),
            isLoading: ref(false),
            error: ref(null),
            refetch: vi.fn()
        } as unknown as ReturnType<typeof useQuery>)

        useProductById(123)

        expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
            queryKey: ['product', 123],
        }))
    })

    it('initializes correctly with Ref id', () => {
        vi.mocked(useQuery).mockReturnValue({
            data: ref(null),
            isLoading: ref(false),
            error: ref(null),
            refetch: vi.fn()
        } as unknown as ReturnType<typeof useQuery>)

        const id = ref(456)
        useProductById(id)

        expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
            queryKey: ['product', id],
        }))
    })
})
