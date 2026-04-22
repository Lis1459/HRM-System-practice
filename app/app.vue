<template>
  <div v-if="mounted">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});
</script>
