import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import type { ILessonSlot } from "../types";
import { lessonSlotApi } from "../api";



export const useLessonSlotStore = defineStore('lesson-slot', () => {
    const lessonSlot = reactive({}) as ILessonSlot

    const lessonDuration = computed(() => lessonSlot.payment.lesson_duration);

    async function getLessonSlot(userIds: number []) {
        const {data} = await lessonSlotApi.get({userIds});
        Object.assign(lessonSlot, data)
    }

    async function updateLessonSlot(id: number, dto: {reason: string}) {
        lessonSlotApi.update(id, dto)
    }


    return {
        lessonSlot,
        lessonDuration,
        getLessonSlot,
        updateLessonSlot
    }
})