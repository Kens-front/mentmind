// store/mentorAvailability.store.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ILessonSlotEvent, IMentorSlot } from '../types'
 
import { mentorSlotAPi } from '../api'
import {getWeekStartMonday, getWeekSunday, parseToDto} from '@/shared/helpers'
import {format, isAfter, isBefore} from "date-fns";
 

type EditSlotPayload = {
  id: number
  date: string
  start: string // 'HH:mm'
  end: string   // 'HH:mm'
}

 

export const useMentorAvailabilityStore = defineStore('mentorAvailability', () => {
 
  const slots = ref<IMentorSlot[]>([]);
  const events = ref<ILessonSlotEvent[]>([])
 
 
  const activeDate = ref('');

  const dtoSlots = computed(() => events.value.map(e => parseToDto(e)))

  const period = computed(() => {
    const firstEvent = events.value[0];

    if (firstEvent) {
      const start = getWeekStartMonday(firstEvent._.startFormatted)
      const end = getWeekSunday(firstEvent._.startFormatted)
      return {
        start,
        end
      }
    }

    return {
      start: format(new Date(), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    };

  })

  const slotsByDate = computed(() => {
    return slots.value.map(slot => new Date(`${slot.date}T00:00`).getTime())
  })

 
  const activeSlots = computed(() => {
    return slots.value.filter(slot => slot.date === activeDate.value);
  })

  // async function getSlots(id: number, query: {from: string, to: string}) {
  //   const {data} = await mentorSlotAPi.getByMentor(query);
  //   const newEvents = data.map(item => {
  //     const newSlot = {  
  //       start: new Date(`${item.date}T${item.start}`),  
  //       end: new Date(`${item.date}T${item.end}`),
  //       _: {
  //         id: item.id
  //       },
  //     } as ILessonSlotEvent
  //     return newSlot;
  //   })
  //
  //   const fromDate = new Date(query.from);
  //   const toDate = new Date(query.to);
  //
  //   events.value = [
  //     // Оставляем слоты ВНЕ диапазона (прошлые/будущие недели)
  //     ...events.value.filter(slot => {
  //       const slotDate = format(slot.start, 'yyyy-MM-dd');
  //       return isBefore(slotDate, query.from) || isAfter(slotDate, query.to);
  //     }),
  //     // Добавляем новые слоты ТЕКУЩЕЙ недели
  //     ...newEvents
  //   ];
  // }

  async function getSlots(id: number, query: {from: string, to: string}) {
    const {data} = await mentorSlotAPi.getByMentor(query);
    events.value = data.map(item => {
      const newSlot = {  start: new Date(`${item.date}T${item.start}`),  end: new Date(`${item.date}T${item.end}`)} as ILessonSlotEvent
      return newSlot;
    })
  }

  async function getSlotsByMentorId(id: number, query: {date: string}) {
    const {data} = await mentorSlotAPi.getByMentorId(id, query);
    slots.value = data
  }

  function parseSlotToDate( dateStr: string, timeStr: string): Date { 
    const [year, month, day] = dateStr.split('-').map(Number) 
    const [hours, minutes] = timeStr.split(':').map(Number)
    return new Date(year!, month! - 1, day, hours, minutes) 
  }

  async function editWorkingSlot(payload: EditSlotPayload) {
    events.value = events.value.map(slot => {
      if (slot._.id !== payload.id) return slot
  
      return {
        ...slot,
        start: parseSlotToDate(payload.date, payload.start),
        end: parseSlotToDate(payload.date, payload.end),
      }
    })

    updateSlots()
  }

  function upsertEvent(event: ILessonSlotEvent) {
    const idx = events.value.findIndex(e => e._.id === event._.id)
    if (idx === -1) events.value = [...events.value, event]
    else events.value = [...events.value.slice(0, idx), event, ...events.value.slice(idx + 1)]
  }

  async function createWorkingSlot(slot: ILessonSlotEvent) {
    // логично: добавить в events и отправить уже обновлённый dtoSlots
    upsertEvent(slot)
    return updateSlots()
  }

  async function deleteSlot(id: number) {
    const deletedEl = events.value.find(el => el._.id === id);
    
    if (deletedEl) {
      const period = {
        start: getWeekStartMonday(deletedEl?._?.startFormatted),
        end: getWeekSunday(deletedEl?._?.startFormatted),
      }

      events.value = events.value.filter(e => e._.id !== id)
      updateSlots(period);
    }
  }

  async function updateSlots(interval?: any) {
    return mentorSlotAPi.create({slots: dtoSlots.value}, interval || period.value);
  }

  return {
    events,
    dtoSlots,
    slots, 
    slotsByDate,
    activeSlots,
    activeDate,
    createWorkingSlot,
    editWorkingSlot,
    getSlots,
    deleteSlot,
    updateSlots,
    getSlotsByMentorId,
  }
})
