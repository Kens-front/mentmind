<template>
    <el-button @click="onClick">
        Закрыть занятие
    </el-button>
</template>

<script setup lang="ts">
 
import { useLessonSlotStore } from '../store';
 
import { useModal } from '@/features/modal/useModal';
import CloseLessonSlot from './CloseLessonSlot.vue';
interface IProps {
    lessonId: number
}

const {lessonId} = defineProps<IProps>()
const modal = useModal()

const {openModal} = modal()
 

async function onClick() {
    openModal(CloseLessonSlot, {title: 'Выберите причину закрытия занятия', lessonId})
}
</script>
<style lang="scss" scoped></style>