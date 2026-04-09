// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./css/default.css',      ],
  modules: [
    '@nuxt/image',
    '@hypernym/nuxt-gsap',
    'nuxt-quasar-ui',
    'nuxt-swiper',
    '@pinia/nuxt',
  ],
  image: {
    format: ['webp', 'avif', 'png', 'jpg'],
    quality: 80
  },
  gsap: {
    extraPlugins: {
      scrollTrigger: true
    }
  },
 
  build: {
    transpile: ['gsap'],
  },
  quasar: {
    extras: {
      fontIcons: ['material-icons']
    },
    plugins: ['Notify'],
  },
 
  plugins: ['~/plugins/yandex-metrika.client.ts'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_API_URL || 'http://localhost:5000',
      yandexMetrikaId: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID  
    }
  }
})