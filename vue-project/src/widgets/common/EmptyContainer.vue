<template>
    <div>
        <slot v-if="isContent"/>
        <el-empty v-else descriptions="Данные отсутствуют" :image-size="300"/>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { ElEmpty } from 'element-plus';
const slots = useSlots()

const emptyChildren = ['v-if']
const isContent = computed(() => {
    if (!slots.default) {
        return false
    }

    const slot = slots.default()

    return slot[0]?.props 
})
</script>