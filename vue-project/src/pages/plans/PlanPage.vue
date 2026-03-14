<script setup lang="ts">

import {computed, onMounted, reactive, ref} from "vue";
import type {IPlan} from "@/features/plan/types";
import {planApi} from "@/features/plan/api";
import Markdown from "@/shared/ui/Markdown.vue";

const plan = reactive({text: ''}) as IPlan

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
    
    <Markdown v-if="plan.text" :text="plan.text"/>
  </div>
</template>

<style scoped lang="scss">
.page {
  color: var(--text-heading);
 
}
 
</style>