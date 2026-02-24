<template>
    <div class="page">
        <h1>Учебные направления</h1>

        <LearnDirectionForm/>

        <LearnDirectionsTable/>
    </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts" setup>
import LearnDirectionForm  from '@/widgets/learnDirections/LearnDirectionForm.vue';
import LearnDirectionsTable from '@/widgets/learnDirections/LearnDirectionsTable.vue';

    
</script>