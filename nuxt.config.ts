// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@nuxt/icon"],
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/logo.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/logo.png",
        },
      ],
    },
  },
  i18n: {
    baseUrl: "https://clevrsend.com",
    strategy: "no_prefix",
    defaultLocale: "de",
    detectBrowserLanguage: false,
    locales: [
      {
        code: "de",
        language: "de-DE",
        file: "de.json",
        name: "Deutsch",
        isCatchallLocale: true,
      },
      {
        code: "en",
        language: "en-US",
        file: "en.json",
        name: "English",
      },
      {
        code: "km",
        language: "km-KH",
        file: "km.json",
        name: "ភាសាខ្មែរ",
      },
      {
        code: "ko",
        language: "ko-KR",
        file: "ko.json",
        name: "한국어",
      },
      {
        code: "tr",
        language: "tr-TR",
        file: "tr.json",
        name: "Türkçe",
      },
    ],
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss://clevrsend-signaling.onrender.com https://clevrsend-signaling.onrender.com wss://clevrsend-signaling.mytechsupport.deno.net https://clevrsend-signaling.mytechsupport.deno.net wss://public.localsend.org https://public.localsend.org https://api.iconify.design; frame-ancestors 'none';",
        },
      },
    },
  },
});
