import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProductById } from '../getProductById'
import { productsApi } from '../../api/productsApi'
import type { ProductInterface } from '../../interfaces'
import type { AxiosResponse } from 'axios'

// Mock logger
vi.mock('@/shared/services/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn()
  }
}))

// Mock productsApi
vi.mock('../../api/productsApi', () => ({
  productsApi: {
    getById: vi.fn()
  }
}))

describe('getProductById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches product successfully', async () => {
    const mockProduct: ProductInterface = {
      id: 1, title: 'P1', slug: 'p1', price: 10, description: 'D1', category: { id: 1, name: 'C1', image: 'I1', slug: 'c1', createdAt: '', updatedAt: '' }, images: [], createdAt: '', updatedAt: ''
    }
    vi.mocked(productsApi.getById).mockResolvedValue({ data: mockProduct } as AxiosResponse<ProductInterface>)

    const result = await getProductById(1)

    expect(productsApi.getById).toHaveBeenCalledWith(1)
    expect(result).toEqual(mockProduct)
  })

  it('throws error when api fails', async () => {
    const error = new Error('Network error')
    vi.mocked(productsApi.getById).mockRejectedValue(error)

    await expect(getProductById(1)).rejects.toThrow('Network error')
  })
})
