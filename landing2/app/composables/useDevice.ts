import { ref, onMounted, onUnmounted } from 'vue'
import { useEventListener } from '@vueuse/core'

export function useDevice() {
    const isDesktop = ref<boolean | undefined>(undefined) // `undefined` = SSR

    onMounted(() => {
        const update = () => {
            isDesktop.value = window.innerWidth >= 768 // или ваш порог
        }
        update()
        useEventListener('resize', update)
    })

    onUnmounted(() => {
        // очистка не нужна — useEventListener сам управляет
    })

    return { isDesktop }
}