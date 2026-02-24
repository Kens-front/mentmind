import { provide, type InjectionKey } from 'vue'
import { useModalStore } from './store'

export const MODAL_KEY: InjectionKey<typeof useModalStore> = Symbol('MODAL')

export function provideModal() {
  const modal = useModalStore()
  provide(MODAL_KEY, () => modal)
}
