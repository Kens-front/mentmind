<script setup lang="ts">
import { provideModal } from './features/modal/provider';
import   ModalContainer from './widgets/ModalContainer.vue';

provideModal()    

</script>

<template>
    <RouterView/>
    <ModalContainer/>
</template>

<style lang="scss" scoped>

</style>
