// Centraliza flags y configuración de entorno que la app puede usar en tiempo de ejecución
export const FORCE_MOCK_PAYMENTS = (import.meta.env.VITE_FORCE_MOCK_PAYMENTS as string) === 'true'

export const STRIPE_PUBLISHABLE_KEY = (import.meta.env.VITE_STRIPE_PK as string) || undefined
