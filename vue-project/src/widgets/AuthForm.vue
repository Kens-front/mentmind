<script setup lang="ts">
import LoginUser from '@/features/auth/components/LoginUser.vue';

</script>

<template>
    <section>
        <LoginUser/>
    </section>
</template>

<style lang="scss" scoped>
section {
  position: relative;
  
  &:after {
    position: absolute;
    width: 100%;
    height: 100%;
    content: "";
    display: block;
    transform: scale(2.5) rotate(311deg);
    right: -50%;
    top: 0;
    background: url("@/shared/assets/stamp.png") no-repeat center/cover;
  }
}
</style>