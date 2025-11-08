<template>
  <div>
    <NavMobile v-if="isMobile" />
    <NavDesktop v-else />
    <div class="nav-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import NavDesktop from './desktop/NavDesktop.vue'
import NavMobile from './mobile/NavMobile.vue'
import { useBreakPoints } from '@/shared/composables'

const { isMobile } = useBreakPoints()
</script>

<style scoped></style>
