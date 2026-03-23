<template>
    <div class="grid">
        
      
        <StatisticCard 
 
            title="Занятия сегодня"     
            :value="Number(analytics[1])" 
        />
 
    </div>
</template>

<script setup lang="ts">
import StatisticCard from '@/entities/common/StatisticCard.vue';
import { analyticApi, type IAnalytic } from '@/features/analytics/api';
import { onMounted, reactive } from 'vue';
import type {ILesson} from "@/features/lessons/types";


const analytics = reactive([[], 0]) as [ILesson[], number];
async function getAnalytics() {
    try {
        const {data} = await analyticApi.get();

        Object.assign(analytics, data)
    } catch {

    }
}

function test() { 
  console.log('test');
}
onMounted(() =>  {
  try {
    getAnalytics()
  } catch (error) {
    console.log(error)
  }
})
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 2.5fr 1.5fr 2fr;
  gap: 1.2rem;
}
</style>