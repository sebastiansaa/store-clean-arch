import type { ZodError } from 'zod'

/**
 * Mappea un ZodError (u otros errores) a un objeto plano { campo: mensaje }
 * - Soporta paths anidados (['address','street'] => 'address.street')
 * - Si el issue no tiene path, coloca el mensaje en la clave '_form'
 */
export function mapZodErrors(err: unknown): Record<string, string> {
  const mapped: Record<string, string> = {}
  if (!err) return mapped

  const maybe = err as any

  // ZodError tiene la propiedad `issues` con array de ZodIssue
  if (maybe?.issues && Array.isArray(maybe.issues)) {
    const issues: Array<any> = maybe.issues
    issues.forEach((issue) => {
      const path = Array.isArray(issue.path) ? issue.path.filter((p: any) => p !== undefined && p !== null).map(String).join('.') : ''
      const key = path || '_form'
      const msg = issue.message ?? String(issue)
      // evita sobreescribir mensajes ya mapeados para la misma clave
      if (!mapped[key]) mapped[key] = msg
    })
    return mapped
  }

  // Si es un Error estándar, usamos su mensaje en '_form'
  if (err instanceof Error) {
    mapped._form = err.message
    return mapped
  }

  // Fallback: stringify
  mapped._form = String(err)
  return mapped
}
