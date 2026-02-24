<template>
    <div class="calendar-page">
        <Calendar 
          title="'qweqweqwe'"
          :events="slotStore.events"
          @on-click="onClick($event.event)"
          @on-drag="onChange"
          @on-created="onCreateSlot"
          @on-ready="init"
          @on-view-change="slotStore.getSlots(authStore.userData.user?.id ?? 0, period)"
          @event-hold="onChange"
        />
    </div>
</template>

<script setup lang="ts">
 
import { useAuthStore } from '@/features/auth/store';
import EditLessonSlot from '@/features/mentor-availability/components/EditLessonSlot.vue';
 
import { useMentorAvailabilityStore } from '@/features/mentor-availability/store';
import type { ILessonSlotEvent } from '@/features/mentor-availability/types';
 
import { useModal } from '@/features/modal/useModal';
import { notifyError, notifySuccess } from '@/shared/config/notifications';
import { dateToISOS } from '@/shared/helpers';
import  Calendar  from '@/shared/ui/Calendar.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
 
import {format} from "date-fns";
 
 
const slotStore = useMentorAvailabilityStore()
const authStore = useAuthStore();
const modal = useModal()
const {openModal} = modal()

const initData = ref< {extendedStart: Date, extendedEnd: Date}>({extendedEnd: new Date(), extendedStart: new Date()})

const period = computed(() => ({
  from: dateToISOS(initData.value.extendedStart),
  to: dateToISOS(initData.value.extendedEnd)
}))
function onClick(slot: ILessonSlotEvent) {
  openModal(EditLessonSlot, {
    title: 'Редактирование времени',
    slot
  })
}

function init(data: {config: any, view: {extendedStart: Date, extendedEnd: Date}}) {
  console.log(123);
  initData.value = data.view;
}

async function onChange() {
  try {
    await slotStore.updateSlots()
    notifySuccess('Слот успешно изменён')
  } catch {

  }
}

async function onCreateSlot(slot: ILessonSlotEvent) {
  try {
    console.log(slot)

    if (slot._.startMinutes > slot._.endMinutes) {
      throw new Error('Недопустимое значение времени')
    }
    await slotStore.createWorkingSlot(slot)
    notifySuccess('Слот успешно создан')
  } catch(e: Error | any) {
      notifyError(e.message)
  }
}

 
 
onMounted(async () => {
 
  try {
    await nextTick();
    await slotStore.getSlots(authStore.userData.user?.id ?? 0, period.value)
  } catch (e) {
    console.error('Ошибка загрузки слотов', e)
  }
})
</script>
<style lang="scss">
.calendar-page {
  display: grid;
  grid-template-rows: 100%;
  height: 100%;
  font-size: 1.4rem;
}

.vuecal--default-theme  {
    height: 100%;
}
</style>