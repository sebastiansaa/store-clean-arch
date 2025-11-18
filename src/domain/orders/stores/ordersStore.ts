import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '../interfaces/types'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const showSuccess = ref(false)

  function loadOrders() {
    const stored = localStorage.getItem('orders')
    if (!stored) {
      orders.value = []
      return orders.value
    }
    try {
      const parsed = JSON.parse(stored)
      orders.value = parsed.map((o: any) => ({ ...o, date: new Date(o.date) }))
    } catch (e) {
      console.error('Error parsing orders:', e)
      orders.value = []
    }
    return orders.value
  }

  function setShowSuccess(value: boolean) {
    showSuccess.value = value
  }

  function clearOrders() {
    orders.value = []
    localStorage.removeItem('orders')
  }

  return {
    orders,
    showSuccess,
    loadOrders,
    setShowSuccess,
    clearOrders,
  }
})

export default useOrdersStore
