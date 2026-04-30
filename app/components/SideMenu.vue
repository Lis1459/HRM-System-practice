<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useAppToast } from "~/composables/useAppToast";
import { Menu } from "primevue";
import EmployeesIcon from "~/components/icons/EmployeesIcon.vue";
import SkillsIcon from "~/components/icons/SkillsIcon.vue";
import LanguagesIcon from "~/components/icons/LanguagesIcon.vue";
import CvsIcon from "~/components/icons/CvsIcon.vue";
import AngleRightIcon from "~/components/icons/AngleRightIcon.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { successToast } = useAppToast();
const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const currentUser = computed(() => authStore.user);

const profileMenu = ref([
  {
    label: "Profile",
    icon: "pi pi-user",
    command: () => successToast("Open profile"),
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    command: () => successToast("Open settings"),
  },
  { separator: true },
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: () => {
      authStore.Logout();
      router.push("/auth/login");
    },
  },
]);

const menu = ref<InstanceType<typeof Menu> | null>(null);

const openProfileMenu = (event: MouseEvent) => {
  menu.value?.toggle(event);
};

type NavItem = {
  route: string;
  label: string;
  icon: ComponentKey;
};
const componentMap = {
  employees: EmployeesIcon,
  skills: SkillsIcon,
  languages: LanguagesIcon,
  cvs: CvsIcon,
};
type ComponentKey = keyof typeof componentMap;

const navItems: NavItem[] = [
  { route: "/users", label: "Employees", icon: "employees" },
  { route: "/skills", label: "Skills", icon: "skills" },
  { route: "/languages", label: "Languages", icon: "languages" },
  { route: "/cvs", label: "CVs", icon: "cvs" },
];

const isActive = (routePath: string) => route.path === routePath;
</script>

<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <nav class="sidebar__nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.route"
        :to="item.route"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item.route) }"
      >
        <component :is="componentMap[item.icon]" class="sidebar__icon" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <Button
      type="button"
      class="profile-button"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      @click="openProfileMenu"
    >
      <Avatar
        shape="circle"
        image="https://i.pravatar.cc/150?img=5"
        class="profile-button__avatar"
      />

      <span class="profile-button__name">
        {{ currentUser?.profile.full_name || "User Name" }}
      </span>
    </Button>
    <Menu id="overlay_menu" ref="menu" :model="profileMenu" :popup="true" />
    <Button
      :icon="isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
      type="button"
      class="collapse-button"
      @click="toggleSidebar"
    >
      <AngleRightIcon
        class="collapse-button__icon"
        :style="{ transform: `rotate(${isCollapsed ? 0 : -180}deg)` }"
      />
    </Button>
  </aside>
</template>

<style sciped>
.sidebar {
  display: flex;
  flex-direction: column;
  padding-top: 44px;
  padding-bottom: 16px;
  transition: width 0.3s ease;
  overflow: hidden;
  width: 200px;
}
.collapsed {
  width: 56px;
  /* justify-content: center; */
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: auto;
}

.sidebar__link {
  display: flex;
  align-items: center;
  height: 56px;
  gap: 16px;
  padding: 9px 16px;
  border-top-right-radius: 200px;
  border-bottom-right-radius: 200px;
  color: var(--p-text-muted-color);
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.sidebar__link:hover,
.sidebar__link--active {
  background: rgba(00, 00, 00, 0.04);
  color: var(--p-surface-500);
}

.sidebar__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.profile-button {
  width: 100%;
  display: flex;
  height: 56px;
  justify-content: flex-start;
  gap: 8px;
  padding: 0 8px;
  border: none;
  border-top-right-radius: 200px;
  border-bottom-right-radius: 200px;
  background: inherit;
  color: var(--p-text-color);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;
}
.collapse-button {
  padding: 8px;
  width: fit-content;
  margin-top: 14px;
  margin-left: 8px;
  border: none;
  background: inherit;
  color: var(--p-text-color);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;
}

.collapse-button__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: transform 200ms;
}

:is(.profile-button, .collapse-button):not(:disabled):hover,
:is(.profile-button, .collapse-button):not(:disabled):active {
  background: rgba(118, 118, 118, 0.04);
  border: none;
  color: var(--p-surface-500);
}

.profile-button__avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.profile-button__name {
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-content {
  padding: 28px 32px;
}
</style>
