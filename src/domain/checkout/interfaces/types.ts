// Tipos de dominio para el dominio `checkout`

export type PaymentMethodId = 'card'

export interface CardPaymentDetails {
    token: string
    last4?: string | null
    brand?: string | null
    cardholder?: string | null
}

export interface PaymentMethod {
    method: PaymentMethodId
    details?: any
}

export interface Customer {
    fullName: string
    address: string
    phone: string
    email: string
    [key: string]: any
}

export interface PaymentIntent {
    id?: string
    status?: string
    [key: string]: any
}

export interface Order {
    id?: string
    total?: number
    items?: any[]
    [key: string]: any
}

export interface CompleteCheckoutPayload {
    customer: Customer
    payment: PaymentMethod
    paymentIntent?: PaymentIntent | null
}

export default {} as const
