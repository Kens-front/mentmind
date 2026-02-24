import type { LESSON_DURATION } from "@/features/lessons/types";
import type { IMentorSlot } from "../types";

type TimeSlot = {
    mentorProfileId: number;
    start: string; // "HH:mm"
    end: string;   // "HH:mm"
    date: string;
    id: number;
};

const toMinutes = (t: string): number => {
    const [h, m] = t.split(":").map(Number)
    return h! * 60 + m!
  }
  
  const roundUpTo30 = (mins: number): number => {
    const m = mins % 60
    if (m === 0 || m === 30) return mins
    if (m < 30) return mins - m + 30
    return mins - m + 60
  }
  
  const format = (mins: number): string =>
    `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`

    export const getAvailableTimes = (
        slots: IMentorSlot[],
        cutHours: LESSON_DURATION
      ): string[] => {
        const cutMins = Math.round(cutHours)
        const result: string[] = []
      
        for (const slot of slots) {
          const slotStart = toMinutes(slot.start)
          const slotEnd = toMinutes(slot.end)
      
          let t = roundUpTo30(slotStart)
      
          while (true) {
            const finish = t + cutMins
      
            // ❗ главная проверка
            if (finish > slotEnd) break
      
            result.push(format(t))
            t += 30
          }
        }
      
        return result
      }
      