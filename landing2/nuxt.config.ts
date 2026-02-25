// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./css/default.css',     'devicon/devicon.min.css'],
  modules: [
    '@nuxt/image',
    '@hypernym/nuxt-gsap',
    'nuxt-quasar-ui',
    'nuxt-monaco-editor',
    'nuxt-swiper',
    '@pinia/nuxt'
  ],
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
  monacoEditor: {
    // These are default values:
    locale: 'en',
    componentName: {
      codeEditor: 'MonacoEditor',
      diffEditor: 'MonacoDiffEditor'
    }
  },
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  }
})