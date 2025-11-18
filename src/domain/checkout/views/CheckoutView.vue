<template>
  <div class="checkout-page">
    <section class="checkout-body">
      <CheckoutSummary :items="items" :total="total" @remove="handleRemove" />

      <div class="right-col">
        <CheckoutSidebar :total="total" @confirm="handleConfirm" @cancel="handleCancel" />
      </div>
      <div class="error" v-if="error">{{ error?.message ?? String(error) }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore } from '@/domain/cart/stores/cartStore'
import CheckoutSummary from '../components/CheckoutSummary.vue'
import CheckoutSidebar from '../components/CheckoutSidebar.vue'
import { useCheckout } from '../composables/useCheckout'
import { useCheckoutStore } from '../stores/checkoutStore'

const router = useRouter()
const cart = cartStore()
const checkoutStore = useCheckoutStore()

const items = computed(() => cart.cartItems)
const total = computed(() => cart.totalPrice)

const { processing, success, performCheckout, error } = useCheckout()

// Resetear el estado del checkout al entrar a la vista
// Esto evita que mensajes de éxito persistan al volver desde otras páginas
onMounted(() => {
  checkoutStore.resetCheckout()
})

function handleRemove(id: number) {
  if (typeof cart.removeFromCart === 'function') cart.removeFromCart(id)
}

function handleCancel() {
  router.back()
}

function handleConfirm(formData: any) {
  performCheckout(formData)
}
</script>

<style scoped>
.checkout-body {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding: 1.25rem;
}
.right-col {
  width: 320px;
}
.processing {
  margin-top: 0.75rem;
}
.success {
  margin-top: 0.75rem;
  color: #0a8a0a;
}

@media (max-width: 800px) {
  .checkout-body {
    flex-direction: column;
  }
  .right-col {
    width: 100%;
  }
}
</style>
