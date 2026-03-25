// plugins/yandex-metrika.client.ts
import { defineNuxtPlugin, useRuntimeConfig, useHead } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const metrikaId = config.public.yandexMetrikaId
const route = useRoute()
 

  if (route.path.startsWith('/dashboard') || route.path.startsWith('/admin')) {
  return
}

  if (!metrikaId || process.env.NODE_ENV !== 'production') {
    return // Не подключаем в dev/staging
  }

  // 1. Добавляем noindex для защиты приватных страниц (опционально)
  useHead({
    meta: [
      {
        name: 'robots',
        content: 'index, follow', // Поменяйте на noindex для /dashboard через middleware
      },
    ],
  })

  // 2. Динамически загружаем скрипт Метрики
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.innerHTML = `
   (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${metrikaId}', 'ym');

    ym(${metrikaId}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
  `
  document.head.appendChild(script)

  // 3. Добавляем noscript-фоллбэк
  const noscript = document.createElement('noscript')
  noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute; left:-9999px;" alt="" /></div>`
  document.head.appendChild(noscript)
})