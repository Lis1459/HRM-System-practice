<script setup lang="ts">
const route = useRoute();

const userId = route.params.userId;
</script>

<template>
  <div>
    <h1>User ID: {{ userId }}</h1>
  </div>
</template>
