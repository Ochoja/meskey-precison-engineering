// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    'motion-v/nuxt',
    '@nuxtjs/sitemap', // should always be at the end
  ],

  fonts: {
    families: [
      {
        name: 'Geist',
        provider: 'google',
        weights: [200, 300, 400, 500, 600, 700],
      },
      {
        name: 'Poppins',
        provider: 'google',
        weights: [300, 400, 500, 600, 700, 800],
      },
    ],
  },
  supabase: {
    redirect: false,
  },
  nitro: {
    preset: 'vercel',
  },
  app: {
    head: {
      title: 'Meskey Precision Engineering', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
});


