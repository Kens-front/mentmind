<template>
    <div class="wrap">
        <el-select v-model="reason">
            <el-option
                v-for="option in CLOSE_REASONS"
                :key="option.label"
                :value="option.value"
                :label="option.label"
            >

            </el-option>
        </el-select>

        <el-button @click="onClick" type="primary">
            Закрыть занятие
        </el-button>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useLessonSlotStore } from '../store';
import { notifySuccess } from '@/shared/config/notifications';
interface IProps {
    lessonId: number
}

const emits = defineEmits(['close']);
const {lessonId} = defineProps<IProps>()
const CLOSE_REASONS = [
    {label: 'Успешное завершение', value:'completed_successfully'},
    {label: 'Отмена ментором (неуважительная)', value: 'disrespectful_mentor'},
    {label: 'Отмена студентом (неуважительная)', value: 'disrespectful_student'},
    {label: 'Отмена ментором (уважительная)', value: 'respectful_mentor'},
    {label: 'Отмена студентом (уважительная)', value: 'respectful_student'},
]
 
const lessonSlotStore = useLessonSlotStore()
const reason = ref('')

async function onClick() {
    try {
        await lessonSlotStore.updateLessonSlot(lessonId, {reason:reason.value })
        emits('close')
        notifySuccess('Занятие успешно закрыто')
    } catch {

    }
}
</script>

<style lang="scss" scoped>
.wrap {
    display: grid;
    grid-template-columns: 4fr 1fr;
    column-gap: 1.6rem;
}
</style>   