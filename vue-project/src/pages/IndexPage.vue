<template>
    <div class="grid">
        <StatisticCard 
            v-if="analytics.data?.total !== undefined"
            title="Все занятия"     
            :value="analytics.data.total" 
        />

        <StatisticCard 
            v-if="analytics.data?.completed !== undefined"
            title="Все завершенные занятия"     
            :value="analytics.data.completed" 
        />

        <StatisticCard 
            v-if="analytics.data?.closer !== undefined"
            title="Все ближайшие занятия"     
            :value="analytics.data.closer" 
        />

        
        <StatisticCard 
            v-if="analytics.data?.cancelled !== undefined"
            title="Все отменные занятия"     
            :value="analytics.data.cancelled" 
        />
      
        <StatisticCard 
            v-if="analytics.data?.totalRevenue !== undefined"
            title="Все оплаченные занятия"     
            :value="Number(analytics.data.totalRevenue)" 
        />

      <StatisticCard
          v-if="analytics.data?.upcomingSum !== undefined"
          title="Оплаты в ближайшие 7 дней"
          :value="Number(analytics.data.upcomingSum)"
      />

      <StatisticCard
          v-if="analytics.data?.averageLessonCount !== undefined"
          title="Среднее количество занятий"
          :value="Number(analytics.data.averageLessonCount)"
      />
    </div>
</template>

<script setup lang="ts">
import StatisticCard from '@/entities/common/StatisticCard.vue';
import { analyticApi, type IAnalytic } from '@/features/analytics/api';
import { onMounted, reactive } from 'vue';


const analytics = reactive({}) as IAnalytic;
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