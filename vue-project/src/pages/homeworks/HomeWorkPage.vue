<template>
    <div class="page">
        <div class="title-c">
            Занятие
        </div>

        <div class="wrap">
            <el-splitter>                
                <el-splitter-panel size="30%" :min="300">
                    <div class="info">
                        <el-steps
                            style="max-width: 600px"
                            :space="500"
                            :active="activeStep"
                            finish-status="success"
                        >
                            <el-step title="Начало" />
                            <el-step title="Проверка" />
                            <el-step title="Проверено" />
                        </el-steps>

                        <el-form label-position="top">
                            <el-form-item label="Название темы">
                                {{ homeworkStore.homework.title }}
                            </el-form-item>

                            <el-form-item label="Название темы">
                                {{ homeworkStore.homework.description}}
                            </el-form-item>

                            <el-button v-if="setVisibleElement([RoleList.STUDENT]) && homeworkStore.homework.status !== EHomeworkStatus.COMPLETED" @click="onClick">Отправить на проверку</el-button>
                            <el-button v-if="setVisibleElement([RoleList.MENTOR])" @click="checkHomeWork">Проверить</el-button>
                        </el-form>
                    </div>
                </el-splitter-panel>

                <el-splitter-panel size="70%">
                    <CodeEditor v-model="homeworkStore.homework.initialCode" />
                </el-splitter-panel>
            </el-splitter>
        </div>
 
    </div>
</template>

<script setup lang="ts">
import { useSetVisibleElement } from '@/features/common/composables/set-visible-element';
import { useHomeWorkStore } from '@/features/homeworks/store';
import { EHomeworkStatus } from '@/features/homeworks/types';
import { RoleList } from '@/features/users/types';
import { notifySuccess } from '@/shared/config/notifications';
import CodeEditor from '@/shared/ui/CodeEditor.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const homeworkId = route.params.id;
const homeworkStore = useHomeWorkStore()
const {setVisibleElement} = useSetVisibleElement()

const HOMERWORK_STATUSES_INDEXES: Record<EHomeworkStatus, number> = {
    [EHomeworkStatus.PENDING]: 0,
    [EHomeworkStatus.CHECKING]: 1,
    [EHomeworkStatus.COMPLETED]:3,
}
const activeStep = computed(() => {
    return HOMERWORK_STATUSES_INDEXES[homeworkStore.homework.status]
 
})

// const activeStep = ref(0)
async function onClick() {
 
    try {
        if (typeof homeworkId === 'string') {
            console.log(homeworkId);
            await homeworkStore.update(Number(homeworkId), {status: EHomeworkStatus.CHECKING, initialCode: homeworkStore.homework.initialCode})
            notifySuccess('Задание успешно отправлено')
        }
    } catch {

    }
}

async function checkHomeWork() {
    try {
        if (typeof homeworkId === 'string') {
            console.log(homeworkId);
            await homeworkStore.update(Number(homeworkId), {status: EHomeworkStatus.COMPLETED, initialCode: homeworkStore.homework.initialCode})
            notifySuccess('Задание успешно отправлено')
        }
    } catch {

    }
}
onMounted(() => {
    try {

        if (typeof homeworkId === 'string') {
            homeworkStore.getOne(Number(homeworkId))
        }
 
    } catch {

    }
})
</script>

<style lang="scss" scoped>
.page {
  grid-template-rows: max-content 1fr;
    height: 100%;
}

.wrap {
    display: grid;
    grid-template-columns: 1fr;
  
  & .el-scrollbar__view {
    height: 100%;
  }
}

.info {
    display: grid;
    row-gap: 3rem;
}
</style>