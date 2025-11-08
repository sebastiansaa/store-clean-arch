<template>
  <transition name="drawer-slide">
    <div v-if="modelValue" class="drawer" @click.self="close">
      <div class="drawer__content">
        <slot />
        <button class="drawer__close" @click="close" aria-label="Cerrar">✕</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])
function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.drawer__content {
  background: #f8f8f8;
  width: 100vw;
  max-width: 480px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 2rem 1rem 1rem 1rem;
  position: relative;
  animation: drawerDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: opacity 0.2s;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  opacity: 0;
}
@keyframes drawerDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
