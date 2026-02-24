<template>
    <div class="page">
        <h1>Занятия</h1>

        <UpdateLesson :role="role" :lesson-id="Number(id)" :form-fields="fields"/>
    </div>
</template>


<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store';
 
import UpdateLesson  from '@/features/lessons/components/UpdateLesson.vue';
import { useLessonStore } from '@/features/lessons/store';
import { RoleList } from '@/features/users/types';
 
import { computed, onMounted} from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id ?? 0
const lessonStore = useLessonStore()
const authStore = useAuthStore()

const role = authStore.userData.user?.role || RoleList.STUDENT;
 
const mentorFields = ['record-link', 'lesson-link', 'duration', 'date', 'lessonType', 'notes', 'mentor', 'student', 'status'];

const fieldsByRole = {
    mentor: mentorFields,
    admin: [],
    student: ['record-link', 'lesson-link', 'duration', 'date', 'lessonType', 'notes', 'mentor', 'student', 'rating']
}


const fields = computed(() => fieldsByRole[role])
onMounted(() => {
    try {
        if (!id) {
            return
        }

        lessonStore.getOne(Number(id))
    } catch {

    }
})
 
</script>

<style lang="scss" scoped></style>