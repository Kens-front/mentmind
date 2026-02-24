<template>
    <div class="wrap">     
        <el-descriptions
            title="Данные о выплате"
            direction="vertical"
            :column="5"
            border
        >

            <el-descriptions-item label="Начало периода">{{ start_date }}</el-descriptions-item>
            <el-descriptions-item label="Конец периода">{{ end_date }}</el-descriptions-item>
            <el-descriptions-item label="Ментор">{{mentorName}}</el-descriptions-item>
            <el-descriptions-item label="Кол-во занятий">{{totalCount}}</el-descriptions-item>
            <el-descriptions-item label="К оплате">{{ totalSum }}</el-descriptions-item>
        </el-descriptions>

        <div class="wrap__button">
            <el-button @click="onClick" type="primary">Оплатить</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { notifySuccess } from '@/shared/config/notifications'
import { useMentorPayoutStore } from '../store'

interface IProps {
    start_date: string
    end_date: string
    mentorId: number
    mentorName: string
    totalSum: number 
    totalCount: number
}

const {start_date, end_date, mentorId, mentorName, totalSum} = defineProps<IProps>()
const mentorPayout = useMentorPayoutStore()
const emits = defineEmits(['close'])

async function onClick() {
    try {
        await mentorPayout.paidSome({start_date, end_date, mentorId, status: 'paid'})
        notifySuccess('Оплата прошла успешно')
        emits('close')
    } catch {

    }
}
</script>

<style lang="scss" scoped>
.wrap {
    display: grid;
    row-gap: 1rem;
    
    &__button {
        justify-self: end;
    }
}
</style>