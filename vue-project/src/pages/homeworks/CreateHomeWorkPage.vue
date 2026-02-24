<template>
    <div class="page">
        <div>
            <h1>Создание домашнего занятия</h1>
        </div>

        <div class="wrap">
            <CreateHomeWorkForm :mentor-id="id ?? null"/>

            <div>
                <CodeEditor v-model="homeworkStore.homework.initialCode"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store';
import { useHomeWorkStore } from '@/features/homeworks/store';
import CodeEditor from '@/shared/ui/CodeEditor.vue';
import CreateHomeWorkForm from '@/widgets/homeworks/CreateHomeWorkForm.vue';
import { computed, ref } from 'vue';

const authStore = useAuthStore()
const homeworkStore = useHomeWorkStore()
const id = computed(() => authStore.userData.user?.id)
 
 const value = ref('')
</script>

<style scoped lang="scss">
.page {
    height: 100%;
}

.wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
}
</style>