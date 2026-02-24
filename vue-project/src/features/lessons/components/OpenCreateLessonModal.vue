<template>
    <div @click="onClick">
        <slot/>
    </div>
</template>

<style lang="scss"></style>

<script lang="ts" setup>
import { useModal } from '@/features/modal/useModal';
import CreateLesson from './CreateLesson.vue';
interface IProps {
    kind: string
    studentIds?: number []
    mentorId?: number
}

const {kind, studentIds, mentorId} = defineProps<IProps>()
const modal = useModal()

const {openModal} = modal();

function onClick() {
    openModal(CreateLesson, {title: 'Создать занятие', kind, studentIds: studentIds || [], mentorId})
}
</script>