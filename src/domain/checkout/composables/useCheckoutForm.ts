import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { CheckoutSchema, fullNameSchema, addressSchema, phoneSchema, emailSchema } from '../schema/checkoutSchema'
import type { CheckoutPayload } from '../schema/checkoutSchema'
import { mapZodErrors } from '../helpers/mapZodErrors'

/**
 * Composable para el formulario de datos del comprador.
 *
 * Gestiona la validación reactiva de campos usando Vee-Validate + Zod.
 * NO procesa el pago - solo valida y devuelve los datos del comprador.
 *
 * El flujo es:
 * 1. Usuario llena los campos (validación en tiempo real)
 * 2. Usuario hace clic en "Continuar"
 * 3. onSubmit() valida y emite los datos al componente padre
 * 4. El padre (CheckoutSidebar) guarda los datos en checkoutStore
 * 5. Más tarde, cuando el usuario hace clic en "Pagar ahora", el store procesa todo
 */
export function useCheckoutForm() {

  const formErrors = ref<Record<string, string>>({})

  const { handleSubmit, values } = useForm<CheckoutPayload>({

    validationSchema: toTypedSchema(CheckoutSchema),
    initialValues: {
      fullName: '',
      address: '',
      phone: '',
      email: '',
    },
  })

  const { value: fullName, errorMessage: fullNameError, handleBlur: fullNameBlur } = useField<string>('fullName', (v: any) => {
    const r = fullNameSchema.safeParse(v)
    return r.success ? true : (r.error?.issues?.[0]?.message ?? 'Valor inválido')
  })

  const { value: address, errorMessage: addressError, handleBlur: addressBlur } = useField<string>('address', (v: any) => {
    const r = addressSchema.safeParse(v)
    return r.success ? true : (r.error?.issues?.[0]?.message ?? 'Valor inválido')
  })

  const { value: phone, errorMessage: phoneError, handleBlur: phoneBlur } = useField<string>('phone', (v: any) => {
    const r = phoneSchema.safeParse(v)
    return r.success ? true : (r.error?.issues?.[0]?.message ?? 'Valor inválido')
  })

  const { value: email, errorMessage: emailError, handleBlur: emailBlur } = useField<string>('email', (v: any) => {
    const r = emailSchema.safeParse(v)
    return r.success ? true : (r.error?.issues?.[0]?.message ?? 'Valor inválido')
  })

  /**
   * Valida y devuelve los datos del formulario como Customer.
   * NO procesa el pago - solo valida los datos del comprador.
   * El pago se maneja en checkoutStore.handlePayment().
   */
  const onSubmit = handleSubmit((vals: CheckoutPayload) => {
    try {
      CheckoutSchema.parse(vals)
      formErrors.value = {}
      console.log('[CheckoutForm] Datos validados:', vals)
      return vals
    } catch (err: any) {
      formErrors.value = mapZodErrors(err)
      console.error('[CheckoutForm] Error de validación:', formErrors.value)
      return null
    }
  })

  return {
    // campos reactivos
    fullName, fullNameError, fullNameBlur,
    address, addressError, addressBlur,
    phone, phoneError, phoneBlur,
    email, emailError, emailBlur,

    // helpers
    values,
    formErrors,
    onSubmit,
  }
}
