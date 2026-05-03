// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/eslint", "@pinia/nuxt", "@primevue/nuxt-module"],
  css: ["@/assets/styles/prime-overrides.css"],
  routeRules: {
    "/auth/**": { appLayout: "auth" },
    "/api/**": { proxy: `${process.env.NUXT_API_PROXY_TARGET}/api/**` },
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
        "Avatar",
        "Breadcrumb",
        "Button",
        "ConfirmDialog",
        "Dialog",
        "Select",
        "FloatLabel",
        "InputText",
        "Menu",
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
