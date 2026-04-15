// https://nuxt.com/docs/api/configuration/nuxt-config
import Lara from "@primeuix/themes/lara";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@pinia/nuxt", "@primevue/nuxt-module"],
  css: ["primeicons/primeicons.css"],
  routeRules: {
    "/auth/**": { appLayout: "auth" },
  },

  typescript: {
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      apiUrl: "",
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "@apollo/client/core",
      ],
    },
  },
  primevue: {
    options: {
      theme: {
        preset: Lara,
      },
    },
  },
});
