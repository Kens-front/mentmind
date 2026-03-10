<script setup lang="ts">

import UpdateUserPlan from "@/features/plan/components/UpdateUserPlan.vue";
import {useRoute} from "vue-router";

const route = useRoute()
const userId = route.params.id
 
 
</script>

<template>
<div class="page">
  <h1>Индивидуальный план</h1>
  
  <UpdateUserPlan :user-id="Number(userId)"/>
</div>
</template>

<style scoped lang="scss">

</style>