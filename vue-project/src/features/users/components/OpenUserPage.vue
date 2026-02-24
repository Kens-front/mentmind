<template>
    <el-tooltip content="Открыть страницу" placement="bottom">
        <router-link :to="link">  <el-icon><TopRight /></el-icon></router-link>
    </el-tooltip>
</template>

<script setup lang="ts">

interface IProps {
    link: string
}

const {link} = defineProps<IProps>()

</script>

<style lang="scss" scoped></style>