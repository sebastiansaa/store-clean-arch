<template>
  <DrawerLateral
    :modelValue="miniCart.isOpen"
    :width="drawerWidth"
    position="right"
    :offsetTop="56"
    @update:modelValue="onUpdate"
  >
    <div class="mini-cart" role="dialog" aria-label="Mini carrito" @click="handlePanelClick">
      <header class="mini-cart__header">
        <h3>Tu carrito</h3>
        <button class="mini-cart__close" @click="miniCart.close">✕</button>
      </header>

      <div class="mini-cart__body" v-if="items.length > 0">
        <ul class="mini-cart__list">
          <li v-for="item in items" :key="item.product.id" class="mini-cart__item">
            <img
              :src="item.product.images?.[0] || ''"
              alt=""
              class="mini-cart__thumb"
              v-if="item.product.images"
            />
            <div class="mini-cart__meta">
              <div class="mini-cart__title">{{ item.product.title }}</div>
              <div class="mini-cart__qty">x{{ item.quantity }}</div>
              <div class="mini-cart__price">{{ formatPrice(item.product.price) }}</div>
            </div>
            <button
              class="mini-cart__remove"
              @click="remove(item.product.id)"
              aria-label="Eliminar"
            >
              ×
            </button>
          </li>
        </ul>

        <div class="mini-cart__summary">
          <div class="mini-cart__total">
            Total: <strong>{{ formatPrice(total) }}</strong>
          </div>
          <div class="mini-cart__actions">
            <BasePaymentButton @click="openCheckout" customClass="primary"
              >Ir a pagar</BasePaymentButton
            >
          </div>
        </div>
      </div>

      <div class="mini-cart__empty" v-else>
        <p>Tu carrito está vacío.</p>
      </div>
    </div>
  </DrawerLateral>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DrawerLateral from '@/shared/components/ui/display/DrawerLateral.vue'
import BasePaymentButton from '@/shared/components/ui/actions/buttons/BasePaymentButton.vue'
import { cartStore } from '@/domain/cart/stores/cartStore'
import { useMiniCartStore } from '../stores/useMiniCartStore'
import { usePaymentNavigation } from '@/domain/cart-summary/composables/usePaymentNavigation'
import { useRouter } from 'vue-router'
import { formatPrice } from '@/shared/helpers/formatPrice'

const cart = cartStore()
const miniCart = useMiniCartStore()
const { goToCheckout } = usePaymentNavigation()
const router = useRouter()

const items = computed(() => cart.cartItems)
const total = computed(() => cart.totalPrice)
const drawerWidth = computed(() => (miniCart.isMini ? '20vw' : '40vw'))

function onUpdate(val: boolean) {
  if (!val) miniCart.close()
}

function handlePanelClick() {
  if (miniCart.isMini) {
    miniCart.expand()
  }
}

function goToCart() {
  miniCart.close()
  router.push('/cart')
}

function openCheckout() {
  miniCart.close()
  goToCheckout()
}

function remove(id: number) {
  cart.removeFromCart(id)
}

// formatPrice ahora proviene de shared/helpers/formatPrice
</script>

<style scoped>
.mini-cart {
  width: 100%;
  max-width: 720px;
  padding: 1rem;
  box-sizing: border-box;
}
.mini-cart__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.mini-cart__list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 50vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mini-cart__item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.mini-cart__thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
}
.mini-cart__meta {
  flex: 1;
}
.mini-cart__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.mini-cart__remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin-left: 0.5rem;
}
.mini-cart__empty {
  padding: 1rem;
  text-align: center;
  color: var(--vt-c-text-light-2);
}
</style>
