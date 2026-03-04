<script setup lang="ts">
import {useModal} from "@/features/modal/useModal.ts";
import CalculatePayment from "@/features/payments/components/CalculatePayment.vue";
import {markRaw} from "vue";

const modal = useModal()
const {openModal} = modal()

function onClick() {
  openModal(markRaw(CalculatePayment), {title: 'Расчёт платежа'})
}
</script>

<template>
  <el-button @click="onClick">
    Оплатить
  </el-button>
</template>

<style scoped lang="scss">

</style>