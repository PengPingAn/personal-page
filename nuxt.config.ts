// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [{ name: "referrer", content: "no-referrer" }],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap",
        },
      ],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  components: [
    { path: "~/components", pathPrefix: false }, // 递归扫描
  ],
  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/icon.css",
    "~/assets/css/input.scss",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "http://localhost:5000/api",
    },
  },
  modules: ["@pinia/nuxt"],
});
