import type { ProductInterface } from '@/domain/products/products/interfaces'

/**
 * Representa un ítem en el carrito de compras.
 * Combina un producto con su cantidad seleccionada.
 */
export interface CartItem {
    product: ProductInterface
    quantity: number
}
