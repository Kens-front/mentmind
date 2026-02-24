import { useAuthStore } from "@/features/auth/store";
import { useMentorAvailabilityStore } from "@/features/mentor-availability/store";
import type { ILessonSlotEvent } from "@/features/mentor-availability/types";



export function useLessonSlots() {
    const authStore = useAuthStore()
    const mentorAvailabilityStore = useMentorAvailabilityStore()

    const userId = authStore.userData.user?.id || 0;

    async function createLessonSlot(slot: ILessonSlotEvent) {
        return mentorAvailabilityStore.createWorkingSlot(slot)
    }

    return {
        createLessonSlot
    }
}