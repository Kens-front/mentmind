<template>
    <EmptyContainer>
        <section>

            <el-select v-model="studentId">
                <el-option 
                    v-for="student in options"
                    :value="student.student_profile?.id"
                    :label="student.fullname"
                />
            </el-select>
            <ul  v-if="homeWorks.length" class="list">
                <li
                    v-for="homework of homeWorks"
                    :key="homework.id"
                >
                    <RouterLink :to="`/homeworks/${homework.id}`">
                        <HomeWork :homework="homework"/>
                    </RouterLink>
                </li>
            </ul>
        </section>
    </EmptyContainer>
</template>

<script setup lang="ts">
import { homeworkApi } from '@/features/homeworks/api';
 
import type { IHomework } from '@/features/homeworks/types';
import {  onMounted, ref, watch } from 'vue';
 
import HomeWork from '@/entities/homework/HomeWork.vue';
import { RouterLink } from 'vue-router';
import EmptyContainer from '../common/EmptyContainer.vue';
import { useUserStore } from '@/features/users/store/store';
import type { IUserFull } from '@/features/users/types';
 
const homeWorks = ref<IHomework []>([])
const userStore = useUserStore()
const options = ref<any []>([])
const studentId = ref(null)

watch(studentId, async() => {
    try {
        homeWorks.value = (await homeworkApi.get({student: studentId.value || -1})).data
    } catch {
        console.log('error')
    }
})
onMounted(async () => {
    try {
 

        const [homeworkItems, students] = await Promise.all([
            homeworkApi.get(),
            userStore.getAll({role: 'student', onlyGroup: 1})
        ])
        homeWorks.value = homeworkItems.data;
        options.value = [...userStore.users, {id: null, fullname: 'Все студенты'}]
    } catch {

    }
})
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

.list {
    display: grid;
    row-gap: 1rem;
}

</style>