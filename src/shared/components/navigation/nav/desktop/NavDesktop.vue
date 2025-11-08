<template>
  <nav class="nav">
    <div class="nav__section nav__section--left">
      <LogoButton />
    </div>

    <div class="nav__section nav__section--right">
      <IconButton class="icon-btn-nav-desktop" aria-label="Carrito" @click="handleSection('cart')">
        <ShoppingBagIcon class="nav-icon" />
      </IconButton>
    </div>
  </nav>
  <NavDesktopCat />
</template>

<script setup lang="ts">
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { IconButton, LogoButton } from '@/shared/components/ui/actions/buttons'
//import { SearchBar } from '@/domain/products/search/components'
import NavDesktopCat from './NavDesktopCat.vue'
import { useNavigation } from '@/shared/composables/useNavigation'

const { handleSection } = useNavigation()
</script>

<style scoped>
.nav-icon {
  width: 24px;
  height: 24px;
  color: #e11d48;
}

.icon-btn-nav-desktop {
  padding: 0.5rem;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.icon-btn-nav-desktop:hover {
  background: #f0f0f0;
}
</style>
