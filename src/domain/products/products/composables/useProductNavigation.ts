import { useRouter } from 'vue-router'
import type { ProductInterface } from '../interfaces'

/**
 * Encapsula la lógica de router y navegación a diferentes vistas de productos
 * Navega por categorias y productos*/

export function useProductNavigation() {
  const router = useRouter()


  const navigateToProduct = (product: ProductInterface) => {
    router.push({
      name: 'ProductDetail',
      params: {
        category: product.category.slug,
        id: product.id.toString(),
      },
    })
  }

  const navigateToCategory = (categorySlug: string) => {
    router.push({
      name: 'ProductsByCategory',
      params: { category: categorySlug },
    })
  }

  return {
    navigateToProduct,
    navigateToCategory,
  }
}
