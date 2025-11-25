import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProducts } from '../useProducts'
import { ref } from 'vue'

// Mock dependencies
vi.mock('../../services/getProducts')
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn()
}))

import { useQuery } from '@tanstack/vue-query'

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes correctly with number categoryId', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: ref([]),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn()
    } as unknown as ReturnType<typeof useQuery>)

    useProducts(1)

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['products', 1],
    }))
  })

  it('initializes correctly with Ref categoryId', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: ref([]),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn()
    } as unknown as ReturnType<typeof useQuery>)

    const categoryId = ref(2)
    useProducts(categoryId)

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['products', categoryId],
    }))
  })
})
