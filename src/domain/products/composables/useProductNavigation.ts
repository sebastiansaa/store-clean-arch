// Navega entre productos y categorías. Evita que el producto anterior se quede "pegado" al navegar hacia otro.

import type { ProductInterface } from '../interfaces'
import { useRouter } from 'vue-router'
import { logger } from '@/shared/services/logger'

export function useProductNavigation() {
  const router = useRouter()

  /**
   * Navega a un producto a partir del objeto `ProductInterface`.
   * Lanza un error si faltan datos necesarios. Devuelve la promesa de `router.push`.
   */
  const navigateToProduct = async (product: ProductInterface) => {
    if (!product || !product.id) {
      const error = new Error('navigateToProduct: product or product.id is missing')
      logger.error('[useProductNavigation] navigateToProduct error', error)
      throw error
    }

    const categoryId = product.category?.id
    if (!categoryId) {
      const error = new Error('navigateToProduct: product.category.id is missing')
      logger.error('[useProductNavigation] navigateToProduct error', error)
      throw error
    }
    try {
      logger.debug(`[useProductNavigation] navigateToProduct: ${product.id}`)
      logger.debug(`[useProductNavigation] navigateToProduct: ${product.id}`)

      return await router.push({
        name: 'productDetail',
        params: {
          categoryId: categoryId.toString(),
          id: product.id.toString(),
        },
      })
    } catch (err) {
      logger.error('Failed to navigate to product', err as Error)
      throw err
    }
  }

  /** Navega a un producto usando categoryId y productId directamente.
   *  Útil cuando no se dispone del objeto completo.*/
  const navigateToProductById = async (categoryId: string, productId: string) => {
    if (!categoryId || !productId) {
      const error = new Error('navigateToProductById: categoryId and productId are required')
      logger.error('[useProductNavigation] navigateToProductById error', error)
      throw error
    }
    try {
      logger.debug(`[useProductNavigation] navigateToProductById: cat=${categoryId}, prod=${productId}`)
      return await router.push({
        name: 'productDetail',
        params: { categoryId: categoryId.toString(), id: productId.toString() },
      })
    } catch (err) {
      logger.error('Failed to navigate to product by id', err as Error)
      throw err
    }
  }

  /** Navega a una categoría usando su slug. Útil para listar productos por categoría. */
  const navigateToCategory = async (categorySlug: string) => {
    if (!categorySlug) {
      const error = new Error('navigateToCategory: categorySlug is required')
      logger.error('[useProductNavigation] navigateToCategory error', error)
      throw error
    }

    try {
      logger.debug(`[useProductNavigation] navigateToCategory: ${categorySlug}`)
      logger.debug(`[useProductNavigation] navigateToCategory: ${categorySlug}`)

      return await router.push({
        name: 'productsByCategory',
        params: { category: categorySlug },
      })
    } catch (err) {
      logger.error('Failed to navigate to category', err as Error)
      throw err
    }
  }

  return {
    navigateToProduct,
    navigateToProductById,
    navigateToCategory,
  }
}
