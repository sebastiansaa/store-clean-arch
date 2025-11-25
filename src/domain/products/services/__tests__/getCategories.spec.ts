import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCategories } from '../getCategories'
import { categoriesApi } from '../../api/categoriesApi'
import type { CategoryInterface } from '../../interfaces'
import type { AxiosResponse } from 'axios'

// Mock logger
vi.mock('@/shared/services/logger', () => ({
    logger: {
        error: vi.fn(),
        debug: vi.fn()
    }
}))

// Mock categoriesApi
vi.mock('../../api/categoriesApi', () => ({
    categoriesApi: {
        getAll: vi.fn()
    }
}))

describe('getCategories', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fetches categories successfully', async () => {
        const mockCategories: CategoryInterface[] = [
            {
                id: 1,
                name: 'C1',
                image: 'I1',
                slug: 'c1',
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01'
            }
        ]
        vi.mocked(categoriesApi.getAll).mockResolvedValue({ data: mockCategories } as AxiosResponse<CategoryInterface[]>)

        const result = await getCategories()

        expect(categoriesApi.getAll).toHaveBeenCalled()
        expect(result).toEqual(mockCategories)
    })

    it('throws error when api fails', async () => {
        const error = new Error('Network error')
        vi.mocked(categoriesApi.getAll).mockRejectedValue(error)

        await expect(getCategories()).rejects.toThrow('Network error')
    })
})
