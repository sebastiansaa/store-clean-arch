import type { Order } from '../interfaces/types'

export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d)
}

export function getStatusLabel(status: Order['status']): string {
    const labels: Record<string, string> = {
        completed: 'Completada',
        pending: 'Pendiente',
        cancelled: 'Cancelada',
    }
    return labels[status] || String(status)
}
