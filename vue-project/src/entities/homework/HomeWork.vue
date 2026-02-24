<template>
    <el-card class="card_wrap">
        <div class="card">
            <p class="title">{{homework.student?.user?.fullname}}</p>
            <p class="subtitle">{{ homework.title }}</p>

            <div class="icon">
                <el-tooltip
                    effect="dark"
                    content="Домашнее задание ещё не выполнено"
                    placement="top"
                >
                    <el-icon size="20"><component :is="icon"/></el-icon>
                </el-tooltip>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import type { IHomework } from '@/features/homeworks/types';
import { AlarmClock, SuccessFilled } from '@element-plus/icons-vue';
import {type Component, computed} from 'vue';

interface IProps {
    homework: IHomework
}

const {homework} = defineProps<IProps>()

const HOMEWORK_STATUSES_ICON: Record<string, Component> = {
    pending: AlarmClock,
    completed: SuccessFilled
}
    
 
const icon = computed(() => HOMEWORK_STATUSES_ICON[homework.status])
</script>

<style lang="scss" scoped>
.card {
    display: grid;
    grid-template-areas:
        'name icon'
        'title icon';
    grid-template-columns: 1fr max-content;
    gap: 1rem;
}

.title {
    grid-area: name;
}

.subtitle {
    grid-area: title;
}

.icon {
    grid-area: icon;
}

</style>