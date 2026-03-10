<script setup lang="ts">
const emits = defineEmits(['click:close-modal'])

onMounted(() => {
  document.body.style.overflow = 'hidden';
})

onBeforeUnmount(() => {
  document.body.style.overflow = 'visible';
})
</script>

<template>
  <div class="modal">
    <div @click="emits('click:close-modal', false)" class="bg"></div>
    
    <div class="window">
      <slot/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 123;
  color: var(--primary-dark);
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(53, 52, 52, 0.68);
  z-index: 123;
}

.window {
  position: absolute;
  top: 50%;
  left: 0;
  height: 50%;
  width: 100%;
  z-index: 123;
}
</style>