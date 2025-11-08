<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavComponent from './shared/components/navigation/nav/NavComponent.vue'
</script>

<template>
  <header>
    <NavComponent />
  </header>
  <div id="app-content">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
body {
  background: #ece9e2;
  margin: 0;
  padding: 0;
}
#app-content {
  background: transparent;
  padding-top: 0;
}
main {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
