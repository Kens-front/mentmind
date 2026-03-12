<script setup lang="ts">

import {computed, onMounted, reactive, ref} from "vue";
import type {IPlan} from "@/features/plan/types";
import {planApi} from "@/features/plan/api";

const plan = reactive({items: ''}) as IPlan

const planItems = computed(() => {
    try {
      return JSON.parse(plan.items)
    } catch {
      
    }
})

async function getPlan() {
  const { data } = await planApi.getByMe();
  Object.assign(plan, data);
}
onMounted(() => {
  try {
    getPlan()
  } catch {
    
  }
})
</script>

<template>
  <div class="page">
    <h1>Индивидуальный план</h1>
    
    <ul>
      <li v-for="item of planItems"> 
        <h3>{{item.title}}</h3>
        
        <div  v-html="item.description"/>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.page {
  color: var(--text-heading);
  
  & div{
    display: grid;
    row-gap: 1rem;
    padding-left: 2rem;
  }
}

ul {
  display: grid;
  row-gap: 1rem;
}
</style>