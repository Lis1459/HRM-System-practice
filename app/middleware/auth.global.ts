import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  const isAuthPage =
    to.path.startsWith("/auth") || to.path.startsWith("/forgot-password");

  if (to.matched.length === 0) {
    return navigateTo("/users");
  }

  if (!authStore.isAuthenticated && !isAuthPage) {
    return navigateTo("/auth/login");
  }

  if (authStore.isAuthenticated && isAuthPage) {
    return navigateTo("/users");
  }
});
