import { useMutation } from '@tanstack/vue-query'
import { createPaymentIntent } from '../services/paymentService'
import type { CreatePaymentIntentResponse } from '../services/paymentService'
/*
Encapsula la mutación para crear un PaymentIntent vía `createPaymentIntent`, usando Vue Query.
  Tipa correctamente la firma de `mutateAsync` para facilitar su uso en componentes.
 * Expone el estado de carga (`isCreating`) y errores (`error`) para control de UI reactiva.
 */
type CreatePaymentVars = { amount: number; currency?: string }

export function useCreatePaymentIntent() {
  // Tipamos la mutación para que callers obtengan mutateAsync con la firma correcta
  const mutation = useMutation<CreatePaymentIntentResponse, Error, CreatePaymentVars>({
    mutationFn: (vars: CreatePaymentVars) => createPaymentIntent(vars.amount, vars.currency ?? 'eur'),
  })

  return {
    createPaymentIntent: (vars: CreatePaymentVars) => mutation.mutateAsync(vars) as Promise<CreatePaymentIntentResponse>,
    isCreating: mutation.isPending,
    error: mutation.error,
  }
}
