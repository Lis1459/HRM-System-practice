// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/eslint", "@pinia/nuxt", "@primevue/nuxt-module"],
  css: ["@/assets/styles/prime-overrides.css"],
  routeRules: {
    "/auth/**": { appLayout: "auth" },
  },

  pinia: {
    /**
     * @default `['stores']`
     */
    storesDirs: [],
  },

  typescript: {
    typeCheck: false,
  },
  runtimeConfig: {
    public: {
      apiUrl: "",
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@apollo/client/core"],
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
    components: {
      include: [
        "Button",
        "FloatLabel",
        "InputText",
        "Message",
        "Password",
        "Tab",
        "TabList",
        "Tabs",
      ],
    },
    options: {
      ripple: true,
    },
    directives: {
      include: ["Ripple"],
    },
    importTheme: { from: "~/theme/mytheme.ts" },
  },
});
