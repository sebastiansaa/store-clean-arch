<template>
  <div class="checkout-sidebar">
    <CheckoutForm @confirm="onCustomerConfirm" @cancel="$emit('cancel')" />

    <PaymentMethods @select="onPaymentSelect" />

    <!-- Mostrar formulario de tarjeta si el método seleccionado es tarjeta -->
    <PaymentCardForm
      v-if="payment?.method === 'card'"
      ref="cardFormRef"
      @tokenized="onCardTokenized"
    />

    <div class="actions">
      <button class="btn primary" :disabled="!canPay || isProcessing" @click="onPayClick">
        Pagar ahora
      </button>
    </div>

    <div class="processing" v-if="isProcessing">Procesando pago...</div>
    <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="success" v-if="success">Pago realizado. Redirigiendo...</div>
  </div>
</template>

<script setup lang="ts">
import CheckoutForm from './CheckoutForm.vue'
import PaymentMethods from './PaymentMethods.vue'
import PaymentCardForm from './PaymentCardForm.vue'
import { useCheckoutSidebar } from '../composables/useCheckoutSidebar'

const props = defineProps<{ total?: number }>()
const emit = defineEmits(['confirm', 'cancel'])

const {
  payment,
  errorMessage,
  isProcessing,
  success,
  canPay,
  cardFormRef,
  onCustomerConfirm,
  onPaymentSelect,
  onCardTokenized,
  handlePay,
} = useCheckoutSidebar()

async function onPayClick() {
  const result = await handlePay(props.total ?? 0)
  if (result) emit('confirm', result)
}
</script>

<style scoped>
.checkout-sidebar {
  width: 100%;
}
.processing {
  margin-top: 0.75rem;
}
.success {
  margin-top: 0.75rem;
  color: #0a8a0a;
}
</style>
