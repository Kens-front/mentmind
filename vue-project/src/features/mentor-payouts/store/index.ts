import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { IMentorPayout } from "../types";
import { mentorPayoutApi } from "../api";



export const useMentorPayoutStore = defineStore('mentor-payout', () => {
    const mentorPayouts = ref<[IMentorPayout [], number]>([[], 0])
    const mentorPayoutFilter = reactive({
        mentorId: null,
        start_date: null,
        end_date: null
    })


    async function onChange(filter: {mentorId: number | null, start_date: string, end_date: string}) {
        const {data} = await mentorPayoutApi.get(filter)
        mentorPayouts.value = data
    }

    async function paidSome(dto: {start_date: string, end_date: string, mentorId: number, status: 'paid'}) {
        const {data} = await mentorPayoutApi.paidSome(dto)
        mentorPayouts.value[0] = data
    }

    return {
        mentorPayouts,
        mentorPayoutFilter,
        onChange,
        paidSome
    }
})