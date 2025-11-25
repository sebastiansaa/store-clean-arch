import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProductNavigation } from '../useProductNavigation'
import { useRouter } from 'vue-router'
import type { ProductInterface } from '../../interfaces'
import type { Router } from 'vue-router'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

describe('useProductNavigation', () => {
  let mockRouter: Partial<Router>

  beforeEach(() => {
    mockRouter = {
      push: vi.fn()
    }
    vi.mocked(useRouter).mockReturnValue(mockRouter as Router)
  })

  describe('navigateToProduct', () => {
    it('navigates to product detail when product is valid', async () => {
      const { navigateToProduct } = useProductNavigation()
      const product: ProductInterface = {
        id: 1,
        title: 'Test Product',
        slug: 'test-product',
        price: 100,
        description: 'Desc',
        category: { id: 10, name: 'Cat', image: 'img', slug: 'cat', createdAt: '', updatedAt: '' },
        images: [],
        createdAt: '',
        updatedAt: ''
      }
      await navigateToProduct(product)

      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'productDetail',
        params: {
          categoryId: '10',
          id: '1',
        },
      })
    })

    it('throws error if product is missing', async () => {
      const { navigateToProduct } = useProductNavigation()
      await expect(navigateToProduct(null as unknown as ProductInterface)).rejects.toThrow('navigateToProduct: product or product.id is missing')
    })

    it('throws error if product id is missing', async () => {
      const { navigateToProduct } = useProductNavigation()
      const product = { title: 'No ID' } as unknown as ProductInterface
      await expect(navigateToProduct(product)).rejects.toThrow('navigateToProduct: product or product.id is missing')
    })

    it('throws error if category id is missing', async () => {
      const { navigateToProduct } = useProductNavigation()
      const product: ProductInterface = {
        id: 1,
        title: 'Test Product',
        slug: 'test-product',
        price: 100,
        description: 'Desc',
        category: { name: 'Cat', image: 'img' } as unknown as ProductInterface['category'], // Force missing ID for test
        images: [],
        createdAt: '',
        updatedAt: ''
      }
      await expect(navigateToProduct(product)).rejects.toThrow('navigateToProduct: product.category.id is missing')
    })
  })

  describe('navigateToProductById', () => {
    it('navigates to product detail with ids', async () => {
      const { navigateToProductById } = useProductNavigation()
      await navigateToProductById('10', '1')

      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'productDetail',
        params: { categoryId: '10', id: '1' },
      })
    })

    it('throws error if params are missing', async () => {
      const { navigateToProductById } = useProductNavigation()
      await expect(navigateToProductById('', '1')).rejects.toThrow('navigateToProductById: categoryId and productId are required')
    })
  })

  describe('navigateToCategory', () => {
    it('navigates to category page', async () => {
      const { navigateToCategory } = useProductNavigation()
      await navigateToCategory('electronics')

      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'productsByCategory',
        params: { category: 'electronics' },
      })
    })

    it('throws error if slug is missing', async () => {
      const { navigateToCategory } = useProductNavigation()
      await expect(navigateToCategory('')).rejects.toThrow('navigateToCategory: categorySlug is required')
    })
  })
})
