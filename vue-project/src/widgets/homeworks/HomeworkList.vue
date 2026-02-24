<template>
    <EmptyContainer>
        <section v-if="homeWorks.length">
            <ul class="list">
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
import {  onMounted, ref } from 'vue';
 
import HomeWork from '@/entities/homework/HomeWork.vue';
import { RouterLink } from 'vue-router';
import EmptyContainer from '../common/EmptyContainer.vue';
 
const homeWorks = ref<IHomework []>([])


 
onMounted(async () => {
    try {
        const {data} = await homeworkApi.get();
        homeWorks.value = data;
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