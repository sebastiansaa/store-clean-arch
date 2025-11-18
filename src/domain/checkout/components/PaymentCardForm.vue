<!--
  Componente PaymentCardForm

  TOKENIZACIÓN AUTOMÁTICA:
  - La tokenización de la tarjeta se realiza AUTOMÁTICAMENTE al hacer clic en "Pagar ahora"
  - NO requiere un botón "Tokenizar" manual
  - El checkoutStore llama a `tokenizePayload()` antes de procesar el pago

  MODOS DE OPERACIÓN:
  - Stripe Mode: Si `FORCE_MOCK_PAYMENTS=false` y `VITE_STRIPE_PK` está configurado
    * Usa Stripe Elements para capturar la tarjeta
    * Tokeniza usando la API real de Stripe
    * Soporta 3D Secure (3DS) automáticamente

  - Mock Mode (ACTUAL): Si `FORCE_MOCK_PAYMENTS=true`
    * Muestra inputs HTML nativos para tarjeta
    * Genera tokens simulados (tok_mock_xxxxx)
    * No valida formato de tarjeta (acepta cualquier número)
    * Simula delay de red (600ms)

  NOTA: La tokenización es transparente para el usuario - simplemente llena los campos y paga.
-->
<template>
  <div class="payment-card-form">
    <h4>Datos de la tarjeta</h4>

    <div class="field">
      <label>Titular</label>
      <input v-model="cardholder" placeholder="Nombre en la tarjeta" />
    </div>

    <!-- Contenedor para Stripe Elements (si está disponible) -->
    <div v-if="mode === 'stripe'" ref="containerRef" class="stripe-card" />

    <!-- Inputs fallback (mock mode) -->
    <div v-else>
      <div class="field">
        <label>Número de tarjeta</label>
        <input v-model="number" placeholder="4242 4242 4242 4242" inputmode="numeric" />
      </div>

      <div class="row">
        <div class="field small">
          <label>Expiración (MM/AA)</label>
          <input v-model="exp" placeholder="04/28" />
        </div>
        <div class="field small">
          <label>CVC</label>
          <input v-model="cvc" placeholder="123" inputmode="numeric" />
        </div>
      </div>
    </div>

    <div class="status">
      <div class="info" v-if="mode === 'mock'">✓ Modo simulación activo</div>
      <div class="error" v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import usePaymentCard, { type TokenizePayload } from '../composables/usePaymentCard'

const props = defineProps<{ publishableKey?: string }>()
const emit = defineEmits(['tokenized'])

// Contenedor donde el composable montará Stripe Elements (si aplica)
const containerRef = ref<HTMLElement | null>(null)

const {
  cardholder,
  number,
  exp,
  cvc,
  processing,
  error,
  mode,
  tokenizingLabel,
  stripeRef,
  elementsRef,
  cardElementRef,
  tokenize,
  tokenizePayload,
  confirmPayment,
} = usePaymentCard(props.publishableKey, containerRef)

async function handleTokenizeClick() {
  const res = await tokenizePayload()
  if (!res) return
  if ('error' in res) return
  // res ya tiene la forma de `TokenizePayload` exportado
  emit('tokenized', res)
}

defineExpose({ confirmPayment, tokenizePayload, stripeRef, elementsRef })
</script>

<style scoped>
.payment-card-form {
  background: #fff;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}
.field {
  margin-bottom: 0.75rem;
}
.field label {
  display: block;
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 0.25rem;
}
.field input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.row {
  display: flex;
  gap: 0.5rem;
}
.small {
  flex: 1;
}
.status {
  margin-top: 1rem;
}
.info {
  color: #0a8a0a;
  font-size: 0.85rem;
  padding: 0.5rem;
  background: #f0f9f0;
  border-radius: 4px;
}
.error {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
.stripe-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.625rem;
  margin-top: 0.5rem;
}

@media (max-width: 800px) {
  .row {
    flex-direction: column;
  }
}
</style>
