<script setup lang="ts">
const route = useRoute();
const router = useRouter();

type AuthTab = {
  route: string;
  label: string;
};

const activeTab = computed<string>(() => route.path);
const items: AuthTab[] = [
  { route: "/auth/login", label: "LOG IN" },
  { route: "/auth/signup", label: "SIGN UP" },
];

const navigateToTab = async (tabRoute: AuthTab["route"]) => {
  await router.push(tabRoute);
};
</script>

<template>
  <div class="auth">
    <Tabs :value="activeTab" class="tabs">
      <TabList>
        <Tab
          v-for="tab in items"
          :key="tab.label"
          :value="tab.route"
          @click.prevent="navigateToTab(tab.route)"
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
  height: 100vh;
  padding: 0px 10px;
}
</style>
