# practicaeco

**Ecommerce moderno sin usuarios, solo comprar.**

Este proyecto es una tienda online construida con Vue 3, Pinia, Vite y TanStack Query, que permite explorar productos, navegar por categorías, agregar al carrito y simular el proceso de compra y pago, todo sin autenticación ni gestión de usuarios. El objetivo es demostrar una arquitectura limpia, modular y profesional, enfocada en la experiencia de compra directa y el código mantenible.

## Características principales

- Navegación profesional y dinámica por categorías (consumidas desde API)
- Visualización de productos filtrados por categoría
- Carrito de compras funcional
- Simulación de proceso de pago
- Sin registro ni login: cualquier visitante puede comprar
- Arquitectura limpia, modular y DRY
- Uso de Vue 3, Pinia, Vue Router, TanStack Query, Axios, Vee-Validate, Zod, Toastification y Heroicons

## Requisitos

- Node.js ^20.19.0 o >=22.12.0
- npm

## Instalación

```bash
npm install
```

## Scripts

- `npm run dev` — Inicia el servidor de desarrollo (Vite)
- `npm run build` — Compila el proyecto para producción
- `npm run preview` — Previsualiza el build de producción
- `npm run lint` — Linting con ESLint
- `npm run format` — Formatea el código con Prettier
- `npm run type-check` — Verifica tipos con TypeScript

## Estructura principal

```
src/
  components/
  views/
  router/
  stores/
  shared/
  App.vue
  main.ts
public/
```

## Tecnologías

- Vue 3
- Pinia
- Vue Router
- Vite
- **TypeScript** (tipado estricto en toda la app)
- Axios
- TanStack Vue Query
- Vee-Validate + Zod
- Heroicons
- Vue Toastification

## Uso de TypeScript

Todo el proyecto está desarrollado con TypeScript, incluyendo componentes, stores y composables. Se recomienda usar un editor con soporte para TS (como VS Code) para aprovechar el tipado y la autocompletación.

## Para decisiones de diseño y arquitectura consulta `DECISIONS.md`.

> Proyecto para práctica de arquitectura limpia, navegación y tipado estricto en Vue 3.

## Checkout y Pagos (Mock)

Este proyecto incluye un **flujo completo de checkout con simulación (mock) de pagos**, preparado para migrar a Stripe cuando tengas un backend real.

### Modo Mock (Actual)

Por defecto, el proyecto funciona en **modo mock** sin necesidad de backend ni claves de Stripe. Esto está controlado por la variable de entorno:

```env
VITE_FORCE_MOCK_PAYMENTS=true
```

**Cómo funciona el mock:**

1. El usuario completa el formulario de checkout (datos personales y tarjeta)
2. El frontend simula la creación de un `PaymentIntent` con un `client_secret` mock
3. El frontend simula la confirmación del pago (sin llamadas reales a Stripe)
4. Se genera un ID de orden simulado (`order_mock_123456789`)
5. El flujo completo funciona sin backend

**Para probarlo:**

```bash
npm run dev
```

Navega al checkout, completa el formulario con cualquier dato (el mock no valida formato de tarjeta), y confirma la compra. Verás la confirmación exitosa con el ID de orden simulado.

### Migración a Stripe Real (Futuro)

Cuando tengas tu backend implementado, solo necesitas:

1. **Cambiar el flag en `.env`:**

   ```env
   VITE_FORCE_MOCK_PAYMENTS=false
   VITE_STRIPE_PK=pk_test_tu_clave_publica
   ```

2. **Implementar 2 endpoints en tu backend:**
   - `POST /api/create-payment-intent`
     - Body: `{ amount: number, currency: string }`
     - Response: `{ client_secret: string }`
   - `POST /api/complete-checkout`
     - Body: `{ customer: {...}, payment: {...}, paymentIntent: {...} }`
     - Response: `{ success: true, orderId: string }`

3. **El código del frontend ya está preparado:**
   - `paymentService.ts` detecta automáticamente si está en modo mock o real
   - `usePaymentCard.ts` carga Stripe Elements cuando `FORCE_MOCK_PAYMENTS=false`
   - Todo el flujo de confirmación con 3D Secure está implementado

**Arquitectura del flujo real:**

1. Frontend solicita `PaymentIntent` al backend → recibe `client_secret`
2. Frontend confirma el pago con `stripe.confirmCardPayment(client_secret, ...)`
3. Stripe maneja 3DS automáticamente (modal/iframe si es necesario)
4. Frontend envía orden + `paymentIntent` al backend para persistir

**Tarjetas de prueba Stripe para 3DS:**

- `4000 0025 0000 3155` — Requiere autenticación 3DS
- Ver más en [documentación de Stripe](https://stripe.com/docs/testing)

## Notas adicionales

- **Persistencia del carrito:** El carrito se guarda en `localStorage` y persiste entre sesiones
- **VueUse integrado:** Uso de composables VueUse (watchDebounced, onClickOutside, useBreakpoints, etc.) para reducir código custom
- **Mock de pagos:** Sistema completo de checkout sin backend, preparado para migración a Stripe real
- **TypeScript estricto:** Todo tipado con interfaces y types explícitos
