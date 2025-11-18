import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { cartStore } from '@/domain/cart/stores/cartStore'
import { completeCheckout } from '../services/paymentService'
import type { CompleteCheckoutResponse } from '../services/paymentService'
import type { CompleteCheckoutPayload } from '@/domain/checkout/interfaces/types'

// Encapsula la lógica del proceso de checkout utilizando `useMutation` de Vue Query. Simula una integración con pasarela de pago, limpia el carrito tras el éxito y redirige al usuario a la vista de órdenes.


export function useCheckout() {
  const router = useRouter()
  const cart = cartStore()
  const checkoutMutation = useMutation<CompleteCheckoutResponse, Error, CompleteCheckoutPayload>({
    mutationFn: async (formData: any) => {
      // Delegar al service centralizado
      const data = await completeCheckout(formData)

      // Guardar orden en localStorage (simulación de persistencia)
      saveOrder(data.orderId || 'unknown', cart.cartItems, cart.totalPrice)

      // Limpiar carrito localmente
      if (typeof cart.clearCart === 'function') {
        cart.clearCart()
      } else {
        const items = cart.cartItems || []
        items.forEach((it: any) => cart.removeFromCart(it.product.id))
      }

      return data
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push({ path: '/orders', query: { success: 'true' } })
      }, 800)
    },
  })

  return {
    performCheckout: checkoutMutation.mutate,
    performCheckoutAsync: checkoutMutation.mutateAsync,
    processing: checkoutMutation.isPending,
    success: checkoutMutation.isSuccess,
    error: checkoutMutation.error,
  }
}

function saveOrder(orderId: string, items: any[], total: number) {
  const order = {
    id: orderId,
    date: new Date().toISOString(),
    status: 'completed',
    items: items.map(item => ({
      id: item.product.id,
      title: item.product.title,
      image: item.product.image,
      quantity: item.quantity,
      price: item.product.price
    })),
    total
  }

  // Cargar órdenes existentes
  const stored = localStorage.getItem('orders')
  const orders = stored ? JSON.parse(stored) : []

  // Agregar nueva orden al inicio
  orders.unshift(order)

  // Guardar (limitado a últimas 20 órdenes)
  localStorage.setItem('orders', JSON.stringify(orders.slice(0, 20)))
}
