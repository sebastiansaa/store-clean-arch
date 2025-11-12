// Navega entre productos y categorías

import type { ProductInterface } from '../interfaces'
import { useRouter } from 'vue-router'

export function useProductNavigation() {
  const router = useRouter()

  /**
   * Navega a un producto a partir del objeto `ProductInterface`.
   * Lanza un error si faltan datos necesarios. Devuelve la promesa de `router.push`.
   */
  const navigateToProduct = async (product: ProductInterface) => {
    if (!product || !product.id) {
      throw new Error('navigateToProduct: product or product.id is missing')
    }

    const categoryId = product.category?.id
    if (!categoryId) {
      throw new Error('navigateToProduct: product.category.id is missing')
    }

    try {
      return await router.push({
        name: 'productDetail',
        params: {
          categoryId: categoryId.toString(),
          id: product.id.toString(),
        },
      })
    } catch (err) {
      console.error('Failed to navigate to product', err)
      throw err
    }
  }

  /** Navega a un producto usando categoryId y productId directamente.
   *  Útil cuando no se dispone del objeto completo.*/
  const navigateToProductById = async (categoryId: string, productId: string) => {
    if (!categoryId || !productId) {
      throw new Error('navigateToProductById: categoryId and productId are required')
    }

    try {
      return await router.push({
        name: 'productDetail',
        params: { categoryId: categoryId.toString(), id: productId.toString() },
      })
    } catch (err) {
      console.error('Failed to navigate to product by id', err)
      throw err
    }
  }

  const navigateToCategory = async (categorySlug: string) => {
    if (!categorySlug) {
      throw new Error('navigateToCategory: categorySlug is required')
    }

    try {
      return await router.push({
        name: 'productsByCategory',
        params: { category: categorySlug },
      })
    } catch (err) {
      console.error('Failed to navigate to category', err)
      throw err
    }
  }

  return {
    navigateToProduct,
    navigateToProductById,
    navigateToCategory,
  }
}
