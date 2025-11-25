import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCategories } from '../useCategories'
import { getCategories } from '../../services/getCategories'
import { ref } from 'vue'
import type { CategoryInterface } from '../../interfaces'

// Mock dependencies
vi.mock('../../services/getCategories')
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn()
}))

import { useQuery } from '@tanstack/vue-query'

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes correctly and calls useQuery', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: ref([]),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn()
    } as unknown as ReturnType<typeof useQuery>)

    useCategories()

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['categories'],
      queryFn: getCategories
    }))
  })

  it('filters categories correctly', () => {
    const mockCategories: CategoryInterface[] = [
      { id: 1, name: 'Clothes', slug: 'clothes', image: 'img1', createdAt: '', updatedAt: '' },
      { id: 2, name: 'Electronics', slug: 'electronics', image: 'img2', createdAt: '', updatedAt: '' },
      { id: 3, name: 'Other', slug: 'other', image: 'img3', createdAt: '', updatedAt: '' }
    ]

    vi.mocked(useQuery).mockReturnValue({
      data: ref(mockCategories),
      isLoading: ref(false),
      error: ref(null),
      refetch: vi.fn()
    } as unknown as ReturnType<typeof useQuery>)

    const { categories } = useCategories()

    expect(categories.value).toHaveLength(2)
    expect(categories.value.map(c => c.name)).toEqual(['Clothes', 'Electronics'])
  })

  it('handles empty data gracefully', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: ref(undefined), // Simulate undefined data initially
      isLoading: ref(true),
      error: ref(null),
      refetch: vi.fn()
    } as unknown as ReturnType<typeof useQuery>)

    const { categories } = useCategories()

    expect(categories.value).toEqual([])
  })
})
