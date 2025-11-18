export interface OrderItem {
    id: number | string
    title: string
    image?: string
    quantity: number
    price: number
}

export type OrderStatus = 'completed' | 'pending' | 'cancelled'

export interface Order {
    id: string
    date: string | Date
    status: OrderStatus
    items: OrderItem[]
    total: number
}

export default {} as const
