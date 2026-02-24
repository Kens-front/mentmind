import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { IStudentPayout } from "../types";
import { studentPaymentApi } from "../api";
import { dateToHHmm, dateToISOS } from "@/shared/helpers";
import {mentorPayoutApi} from "@/features/mentor-payouts/api";


export const useStudentPaymentStore = defineStore('payment', () => {

    const studentPayments = ref<[IStudentPayout [], number]>([[], 0]);

    const studentPaymentsWithIndexes = computed(() => studentPayments.value[0].map((payment, index) => {
        const paidDate = payment.paidAt ? `${dateToISOS(new Date(payment.paidAt))} ${dateToHHmm(new Date(payment.paidAt))}` : null;
        return {
            ...payment, 
            index, 
            status: payment.status === 'paid' ? 'Оплачено' : 'Не оплачено',
            paidAt: paidDate
        }
    }))
 
    async function getAll() {
        const {data} = await studentPaymentApi.get({})
        studentPayments.value = data;
        console.log(data)
    }

    async function onChange(filter: {mentorId: number | null, start_date: string, end_date: string}) {
        const {data} = await studentPaymentApi.get(filter)
        studentPayments.value = data
    }

    return {
        studentPayments,
        studentPaymentsWithIndexes,
        onChange,
        getAll
    }
})