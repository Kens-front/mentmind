<template>
    <el-button data-cy="submit" @click="onClick">Провести занятие</el-button>
</template>

<script setup lang="ts">
import { notifySuccess } from '@/shared/config/notifications';
import { useLessonStore } from '../store';

interface IProps {
    lessonId: number
}

const {lessonId} = defineProps<IProps>()
const lessonStore = useLessonStore()

async function onClick() {
    try {
        lessonStore.completeLesson(lessonId);
        notifySuccess('Занятие успешно проведено')
    } catch {

    }
}

</script>
<style lang="scss" scoped></style>