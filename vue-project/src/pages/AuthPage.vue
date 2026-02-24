<template>
    <div class="page">
        <AuthForm/>
    </div>
</template>

<script setup lang="ts">
import AuthForm from '@/widgets/AuthForm.vue';

</script>

<style scoped lang="scss">
.page {
    display: grid;
    grid-template-columns: 30%;
    align-items: center;
    justify-content: center;
    height: 100%;
}

</style>