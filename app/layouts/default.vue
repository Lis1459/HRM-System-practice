<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { USER } from "~/graphql/users";
import type { UserQuery } from "~/graphql/users/types";

const route = useRoute();
const { $apollo } = useNuxtApp();

const userIdParam = computed(() =>
  String(route.params.userId || route.params.id || ""),
);

const pathArray = computed(() => route.path.split("/").slice(1));
console.log(pathArray.value);

const currentUser = ref<UserQuery["user"] | null>(null);
const loadingUser = ref(false);

const profileBreadcrumbItem = computed(() => {
  const userId = userIdParam.value;
  if (!userId || !route.path.startsWith("/users/")) return null;

  const label = currentUser.value
    ? `${currentUser.value.profile?.first_name ?? ""} ${currentUser.value.profile?.last_name ?? ""}`.trim()
    : "Loading...";

  return {
    label: label || "Profile",
    profile: true,
  };
});

const breadcrumbItems = computed(() => {
  const items: Array<{
    label: string;
    to?: string;
    profile?: boolean;
    disabled?: boolean;
  }> = [];
  let destinationPath = "";
  pathArray.value.forEach((item) => {
    destinationPath += `/${item}`;
    if (item === "users") {
      items.push({ label: "Employees", to: destinationPath });
    } else if (!isNaN(Number(item))) {
      if (profileBreadcrumbItem.value) {
        items.push({
          ...profileBreadcrumbItem.value,
          to: destinationPath,
        });
      }
    } else {
      items.push({
        label: item[0]?.toUpperCase() + item.slice(1),
        to: destinationPath,
      });
    }

    console.log(items);
  });

  return items.map((item, index) => ({
    ...item,
    disabled: index === items.length - 1,
    to: index === items.length - 1 ? undefined : item.to,
  }));
});

const fetchUser = async (userId: string) => {
  if (!userId) return;
  loadingUser.value = true;
  try {
    const { data } = await $apollo.query<UserQuery>({
      query: USER,
      variables: { userId },
    });
    currentUser.value = data?.user ?? null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    currentUser.value = null;
  } finally {
    loadingUser.value = false;
  }
};

watch(
  () => route.path,
  async () => {
    if (route.path.startsWith("/users/") && userIdParam.value) {
      await fetchUser(userIdParam.value);
    } else {
      currentUser.value = null;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="layout">
    <SideMenu />

    <main class="main-content">
      <div v-if="breadcrumbItems.length" class="layout-breadcrumb-wrapper">
        <Breadcrumb :model="breadcrumbItems" class="layout-breadcrumb">
          <template #item="{ item }">
            <template v-if="item.profile">
              <span class="layout-breadcrumb__profile">
                <i class="pi pi-user layout-breadcrumb__icon" />
                <nuxt-link class="layout-breadcrumb__label" :to="item.to">{{
                  item.label
                }}</nuxt-link>
              </span>
            </template>
            <template v-else-if="item.to && !item.disabled">
              <nuxt-link :to="item.to">{{ item.label }}</nuxt-link>
            </template>
            <template v-else>
              <span>{{ item.label }}</span>
            </template>
          </template>
        </Breadcrumb>
      </div>

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
.main-content {
  min-width: 0;
}

.layout-breadcrumb-wrapper {
  padding: 16px 20px 12px;
}

.layout-breadcrumb {
  color: var(--p-surface-60);
  padding: 0;
  padding-left: 20px;
  margin: 0;
}

.layout-breadcrumb__profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--p-primary-500);
}

.layout-breadcrumb__icon {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .layout-breadcrumb {
    margin: 0 16px;
  }
}
</style>
