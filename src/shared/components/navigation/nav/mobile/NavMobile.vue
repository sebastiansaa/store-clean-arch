<template>
  <div class="nav-wrapper">
    <nav class="nav">
      <div class="nav__section nav__section--left">
        <LogoButton />
        <button class="nav__burger" @click="isOpen = !isOpen" aria-label="Abrir menú">
          <span v-if="!isOpen">&#9776;</span>
          <span v-else>✕</span>
        </button>
      </div>
      <div class="nav__section nav__section--right">
        <div class="nav__right-icons">
          <button
            class="icon-btn-nav-movil"
            aria-label="Carrito"
            @click="handleSectionMobile('cart')"
          >
            <ShoppingBagIcon class="nav-icon" />
          </button>
        </div>
      </div>
    </nav>

    <!-- SearchBar debajo del nav en móvil
    <div class="nav__searchbar-mobile">
      <SearchBar />
    </div>
    -->

    <NavMobileCat :isOpen="isOpen" @update:isOpen="isOpen = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { LogoButton } from '@/shared/components/ui/actions/buttons'
import { useNavigation } from '@/shared/composables/useNavigation'

//import { SearchBar } from '@/domain/search/components'
import NavMobileCat from './NavMobileCat.vue'

const isOpen = ref(false)
const { handleCategory, handleSection } = useNavigation()

function handleCategoryMobile(categoryId: number) {
  handleCategory(categoryId)
  isOpen.value = false
}

function handleSectionMobile(section: string) {
  handleSection(section)
  isOpen.value = false
}
</script>

<style scoped>
.icon-btn-nav-movil {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #222;
  margin-right: 0;
  transition: background 0.2s;
  border-radius: 50%;
  padding: 0.5rem;
}
.icon-btn-nav-movil:hover {
  background: #ececec;
}

.nav__section--right {
  position: absolute;
  right: 0.2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 3;
}

.nav__right-icons {
  display: flex;
  gap: 0.05rem;
  margin-right: 0;
  align-items: center;
}
.nav-wrapper {
  position: relative;
}
.nav {
  min-height: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 1rem;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
  border-radius: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
}
.nav__section--left {
  flex: 1;
  justify-content: center;
  position: relative;
  min-height: 56px;
  height: 56px;
}
.nav__logo-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  z-index: 1;
}
.nav__burger {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  z-index: 2;
  display: block !important;
  color: #222;
}
.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
