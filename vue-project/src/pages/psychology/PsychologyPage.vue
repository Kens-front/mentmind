<script setup lang="ts">

import Calendar from "@/shared/ui/Calendar.vue";
import OpenCreatePsychologySessionModal
  from "@/features/psychology-sessions/components/OpenCreatePsychologySessionModal.vue";
import {onMounted} from "vue";
import {usePsychologySessionStore} from "@/features/psychology-sessions/store";
import {useModal} from "@/features/modal/useModal.ts";
import SessionModal from "@/entities/psychology/SessionModal.vue";

const sessionStore = usePsychologySessionStore()

const modal = useModal()
const {openModal} = modal()
function onClick(event: any) {
  console.log(event)
    openModal(SessionModal, {title: 'Психологическая сессия', time: event.event?.time, date: event.event?.date})
}
onMounted(() => {
  try {
    sessionStore.getPsychologySessions()
  } catch  {
    
  }
})
</script>

<template>
  <div>
    <OpenCreatePsychologySessionModal/>
    
    <Calendar 
        :title="'Сессии'"
        :events="sessionStore.events"
        @on-click="onClick"
    >
    </Calendar>
  </div>
</template>

<style scoped lang="scss">

</style>