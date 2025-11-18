<template>
  <div class="orders-list">
    <h1>Tus órdenes</h1>

    <div class="success-message" v-if="showSuccess">
      <div class="icon">✓</div>
      <div>
        <h2>¡Pago realizado con éxito!</h2>
        <p>Tu orden ha sido confirmada. Pronto recibirás un email con los detalles.</p>
      </div>
    </div>

    <div class="orders-container">
      <div v-if="orders && orders.length === 0" class="empty-state">
        <p>No tienes órdenes todavía.</p>
        <router-link to="/" class="btn primary">Ir a comprar</router-link>
      </div>

      <div v-else>
        <OrderCard v-for="order in orders" :key="order.id" :order="order" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Order } from '../interfaces/types'
import OrderCard from './OrderCard.vue'

defineProps({
  orders: { type: Array as PropType<Order[]>, required: true },
  showSuccess: { type: Boolean, required: false },
})
</script>

<style scoped>
/* reuse existing styles from view; keep minimal here as shared styles live in parent */
.orders-list {
  padding: 1.25rem;
  max-width: 1200px;
  margin: 0 auto;
}
.success-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f0f9f0;
  border: 1px solid #0a8a0a;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}
.orders-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #fff;
  border-radius: 8px;
}
</style>
