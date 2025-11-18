# Server Example (Backend para Stripe Real)

⚠️ **Este backend NO está en uso actualmente.**

El proyecto está configurado en **modo mock** (`VITE_FORCE_MOCK_PAYMENTS=true`), por lo que no necesita este servidor.

## ¿Cuándo usar este servidor?

Cuando estés listo para migrar del mock a Stripe real, necesitarás:

1. Un backend con tu `STRIPE_SECRET_KEY`
2. Endpoints para crear PaymentIntents y completar checkout

Este servidor es un **ejemplo de referencia** para cuando llegue ese momento.

## Cómo usarlo (futuro)

1. **Configurar variables de entorno:**

   ```bash
   cd server-example
   cp .env.example .env
   # Editar .env y agregar tu STRIPE_SECRET_KEY de pruebas
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Iniciar el servidor:**

   ```bash
   npm start
   ```

4. **Cambiar el frontend a modo real:**

   En el archivo `.env` del proyecto principal:

   ```env
   VITE_FORCE_MOCK_PAYMENTS=false
   VITE_STRIPE_PK=pk_test_tu_clave_publica
   ```

## Endpoints implementados

- `POST /api/create-payment-intent` — Crea un PaymentIntent en Stripe y devuelve `client_secret`
- `POST /api/complete-checkout` — Endpoint simulado para guardar la orden (aquí deberías persistir en BD)

## Notas

- Este servidor es un ejemplo mínimo para desarrollo local
- En producción necesitarás:
  - Validación de datos del request
  - Autenticación/autorización si la app evoluciona
  - Base de datos para persistir órdenes
  - Webhooks de Stripe para confirmar pagos
  - HTTPS obligatorio para 3DS
