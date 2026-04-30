<script setup lang="ts"></script>

<template>
  <div class="layout">
    <SideMenu />

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>
