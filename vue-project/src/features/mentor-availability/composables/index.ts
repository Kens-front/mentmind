import { useLessonStore } from "@/features/lessons/store";
import { useMentorAvailabilityStore } from "../store";
import { getAvailableTimes } from "../helpers";
import { computed } from "vue";
import { LESSON_DURATION } from "@/features/lessons/types";
import { useLessonSlotStore } from "@/features/lesson-slots/store";
import { useLessonPackageStore } from "@/features/lesson-package/store";

export function useMentorEnableHours() {
    const mentorAvailabilityStore = useMentorAvailabilityStore();
    const lessonPackageStore = useLessonPackageStore()

    const enabledTime = computed(() => {
        if (!mentorAvailabilityStore.activeSlots.length) {
            return[]
        }

 
        return getAvailableTimes(mentorAvailabilityStore.activeSlots, lessonPackageStore.lessonPackage?.duration || LESSON_DURATION.MIN).sort((a,b) => parseInt(a) - parseInt(b))
    })

    return {
        enabledTime
    }
}