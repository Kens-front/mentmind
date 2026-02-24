<script setup lang="ts">
import { useHomeWorkStore } from '@/features/homeworks/store';
import type { ICreateHomeworkDto } from '@/features/homeworks/types';
import { userApi } from '@/features/users/api';
 
import { RoleList, type TUserFull } from '@/features/users/types';
import { notifySuccess } from '@/shared/config/notifications';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

interface IProps {
    mentorId: number | null
}

const router = useRouter()
const {mentorId} = defineProps<IProps>()
const homeworkStore = useHomeWorkStore()
 

const students = ref<TUserFull []>([])
const homework = reactive({}) as ICreateHomeworkDto
async function onClick(dto: ICreateHomeworkDto) {
    try {
        await homeworkStore.create(dto)
        notifySuccess('Домашнее задание создано')
        router.push('/homeworks')
    } catch {

    }
}

onMounted(async () => {
    try {
        const {data} = await userApi.getAll({role: RoleList.STUDENT, mentorId });
        students.value = data
    } catch {

    }
})
</script>
    
<template>
    <section>
        <el-form label-position="top">
            <el-form-item label="Студент">
                <el-select 
                    v-model="homework.studentId"
                >
                    <el-option
                        v-for="student of students"
                        :key="student.id"
                        :value="student.id"
                        :label="student.fullname"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="Тема">
                <el-input v-model="homework.title"/>
            </el-form-item>

            <el-form-item label="Описание">
                <el-input v-model="homework.description" type="textarea"/>
            </el-form-item>

            <el-form-item>
                <el-button @click="onClick(homework)">Сохранить</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>