<script setup lang="ts">
const route = useRoute();
console.log(route.fullPath);

const activeTab = computed(() => route.path);
</script>

<template>
  <div class="auth">
    <Tabs :value="activeTab">
      <TabList>
        <Tab value="/auth/login">
          <NuxtLink to="./login">LOG IN</NuxtLink>
        </Tab>
        <Tab value="/auth/signup">
          <NuxtLink to="./signup">SIGN UP</NuxtLink>
        </Tab>
      </TabList>
    </Tabs>

    <slot />
  </div>
</template>
