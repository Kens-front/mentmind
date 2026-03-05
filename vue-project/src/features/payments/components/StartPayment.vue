<script setup lang="ts">

import {studentPaymentApi} from "@/features/payments/api";
import type {ICreatePaymentDto} from "@/features/payments/types";
interface IProps {
  body: ICreatePaymentDto | undefined;
}

const {body} = defineProps<IProps>()
async function onClick() {
  try {
    if(!body) {
      return
    }
    const {data} = await studentPaymentApi.create(body)
    
    if (data?.confirmation?.confirmation_url) {
 
      window.location.href = data.confirmation.confirmation_url
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <el-button @click="onClick" class="button">
    Начать оплату
  </el-button>
</template>

<style scoped lang="scss">
 
</style>