<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const activeTab = computed(() => route.path);
const items = [
  { route: "/auth/login", label: "LOG IN" },
  { route: "/auth/signup", label: "SIGN UP" },
];
</script>

<template>
  <div class="auth">
    <Tabs :value="activeTab" class="tabs">
      <TabList>
        <Tab
          v-for="tab in items"
          :key="tab.label"
          :value="tab.route"
          @click.prevent="() => router.push(`${tab.route}`)"
        >
          {{ tab.label }}
        </Tab>
      </TabList>
    </Tabs>
    <slot />
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
