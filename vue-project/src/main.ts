import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './shared/scss/main.scss'
import { vMaska } from 'maska/vue'
import { ru } from 'element-plus/es/locales.mjs'
import '@mobilon-dev/chotto/style.css'
import  VueCookie  from 'vue-cookies'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: ru,
})

app.use(VueCookie)
app.directive('maska', vMaska)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.mount('#app')
