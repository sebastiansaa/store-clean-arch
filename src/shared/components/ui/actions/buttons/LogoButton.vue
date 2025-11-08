<template>
  <button @click="goHome" class="nav__logo-btn">
    <img src="@/assets/logo.svg" alt="Logo" class="nav__logo" />
  </button>
</template>

<script setup lang="ts">
import { useNavLogic } from '../../../../composables'

const { goHome } = useNavLogic()
</script>

<style scoped>
.nav__logo-btn {
  background: none;
  border: none;
  cursor: pointer;
}
.nav__logo {
  height: 32px;
  width: 32px;
}
</style>
