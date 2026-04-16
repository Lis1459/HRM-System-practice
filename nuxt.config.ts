// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/eslint", "@pinia/nuxt", "@primevue/nuxt-module"],
  css: [
    "primeicons/primeicons.css",
    "@fontsource/roboto/500.css",
    "@fontsource/roboto/600.css",
    "@fontsource/roboto/700.css",
    "@/assets/styles/prime-overrides.css",
  ],
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
    build: {
      sourcemap: false,
    },
    server: {
      hmr: {
        overlay: false,
      },
    },
  },
  primevue: {
    importTheme: { from: "~/theme/mytheme.ts" },
  },
});
