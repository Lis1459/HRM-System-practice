// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/eslint", "@primevue/nuxt-module"],
  css: ["@/assets/styles/prime-overrides.css"],
  routeRules: {
    "/auth/**": { appLayout: "auth" },
  },

  typescript: {
    // Keep Nuxt dev server responsive; run `npm run typecheck` manually when needed.
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
        "Password",
        "Tab",
        "TabList",
        "Tabs",
      ],
    },
    directives: {
      include: ["Ripple"],
    },
    importTheme: { from: "~/theme/mytheme.ts" },
  },
});
