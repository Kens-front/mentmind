<script setup lang="ts">
import { studentPaymentsColumns } from '@/features/payments/constants';
import { useStudentPaymentStore } from '@/features/payments/store';
import UiTable from '@/shared/ui/UiTable.vue';
 

const paymentStore = useStudentPaymentStore()

 
</script>

<template>
    <section>
        <UiTable :data="paymentStore.studentPaymentsWithIndexes" :columns="studentPaymentsColumns"/>
    </section>
</template>
 


<style lang="scss" scoped></style>