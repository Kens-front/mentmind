import { reactive, readonly, type Component } from 'vue'

 
export type ModalPayload = {
  component: any
  props?: any
}

const state = reactive<{
  stack: ModalPayload[]
}>({
  stack: []
})

function openModal(component: Component, props: any) {
  state.stack.push({ component, props })
}

function closeModal() {
  state.stack.pop()
}

function closeAll() {
  state.stack.length = 0
}

export function useModalStore() {
  return {
    state: readonly(state),
    openModal,
    closeModal,
    closeAll
  }
}
