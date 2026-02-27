<template>
    <Teleport to="body">
        <div v-if="stack.length" class="modal">
            <div @click="close" class="modal-overlay"></div>

            <div class="window">
                <div class="top">
                    <h3>
                        {{ title }}
                    </h3>

                    <el-button @click="close">X</el-button>
                </div>
                <div class="inner-wrapper">
                    <component
                        v-for="(modal, index) in stack"
                        :key="index"
                        :is="modal.component"
                        v-bind="modal.props"
                        @close="close"
                    >
                      <component :is="modal.props.slot"/>
                    </component>
                </div>
            </div>
        </div>
    </Teleport>
  </template>

  <script setup lang="ts">
  import { useModalStore } from '@/features/modal/store';
import { computed } from 'vue';

  const { state, closeModal } = useModalStore()

  const stack = state.stack

  const title = computed(() => stack[stack.length - 1]?.props?.title || 'Подтвердите действие');

  const close = () => closeModal()
  </script>

  <style scoped>
.actions {
  display: flex;
  justify-content: end;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: minmax(20%, 50%);
  width: 100%;
  height: 100%;
  z-index: 10;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.4);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.inner-wrapper {
  display: grid;
  row-gap: 1rem;
  padding-top: 1rem;
}
.window {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 1rem;
 
}
  </style>
