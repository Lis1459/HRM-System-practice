import { ToastService } from "primevue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ToastService);
});
