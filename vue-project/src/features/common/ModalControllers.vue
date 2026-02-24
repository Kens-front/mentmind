<template>
    <div class="actions">
        <el-button data-testid="learn-direction-edit-save" native-type="submit" @click="emits('confirm')">
            Сохранить
        </el-button>

        <el-button data-testid="learn-direction-edit-cancel" @click="emits('cancel')">
            Отмена
        </el-button>
    </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['cancel', 'confirm'])
</script>
<style lang="scss" scoped></style>