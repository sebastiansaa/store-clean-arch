import { useQuery } from '@tanstack/vue-query'
import { useTimeoutFn } from '@vueuse/core'
import { useOrdersStore } from '../stores/ordersStore'
import type { Order } from '../interfaces/types'

export function useOrders() {
    const store = useOrdersStore()

    const query = useQuery<Order[], Error>({
        queryKey: ['orders'],
        queryFn: async () => {
            // Simulación: leer desde localStorage a través del store
            return store.loadOrders()
        },
    })

    // Cuando se establezca showSuccess en true, ocultarlo automáticamente en 5s
    function watchSuccess() {
        if (!store.showSuccess) return
        const { stop } = useTimeoutFn(() => store.setShowSuccess(false), 5000)
        // stop no se usa, solo se inicia el timeout
        void stop
    }

    return {
        query,
        orders: query.data,
        isLoading: query.isLoading,
        refetch: query.refetch,
        watchSuccess,
    }
}

export default useOrders
