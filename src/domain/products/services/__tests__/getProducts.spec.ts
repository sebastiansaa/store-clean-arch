import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProducts } from '../getProducts'
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
    getAll: vi.fn()
  }
}))

describe('getProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches products successfully without category', async () => {
    const mockProducts: ProductInterface[] = [
      { id: 1, title: 'P1', slug: 'p1', price: 10, description: 'D1', category: { id: 1, name: 'C1', image: 'I1', slug: 'c1', createdAt: '', updatedAt: '' }, images: [], createdAt: '', updatedAt: '' }
    ]
    vi.mocked(productsApi.getAll).mockResolvedValue({ data: mockProducts } as AxiosResponse<ProductInterface[]>)

    const result = await getProducts()

    expect(productsApi.getAll).toHaveBeenCalledWith(undefined)
    expect(result).toEqual(mockProducts)
  })

  it('fetches products successfully with category', async () => {
    const mockProducts: ProductInterface[] = []
    vi.mocked(productsApi.getAll).mockResolvedValue({ data: mockProducts } as AxiosResponse<ProductInterface[]>)

    await getProducts(5)

    expect(productsApi.getAll).toHaveBeenCalledWith(5)
  })

  it('throws error when api fails', async () => {
    const error = new Error('Network error')
    vi.mocked(productsApi.getAll).mockRejectedValue(error)

    await expect(getProducts()).rejects.toThrow('Network error')
  })
})
