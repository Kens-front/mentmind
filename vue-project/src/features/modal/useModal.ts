import { inject } from 'vue'
import { MODAL_KEY } from './provider'

export function useModal() {
  const modal = inject(MODAL_KEY)

  if (!modal) {
    throw new Error('ModalProvider is not registered')
  }

  return modal
}
