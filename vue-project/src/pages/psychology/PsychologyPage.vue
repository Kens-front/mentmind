<script setup lang="ts">

import Calendar from "@/shared/ui/Calendar.vue";
import OpenCreatePsychologySessionModal
  from "@/features/psychology-sessions/components/OpenCreatePsychologySessionModal.vue";
import {computed, onMounted} from "vue";
import {usePsychologySessionStore} from "@/features/psychology-sessions/store";
import {useModal} from "@/features/modal/useModal.ts";
import SessionModal from "@/entities/psychology/SessionModal.vue";
import {useAuthStore} from "@/features/auth/store";

const sessionStore = usePsychologySessionStore()
const authStore = useAuthStore()

const role = computed(() => authStore.role)
const modal = useModal()
const {openModal} = modal()
function onClick(event: any) {
  console.log(event)
    openModal(SessionModal, {
      title: 'Психологическая сессия', 
      time: event.event?.time, 
      date: event.event?.date,
      id: event.event?.id,
      role: role.value
    })
}
onMounted(() => {
  try {
    sessionStore.getPsychologySessions()
  } catch  {
    
  }
})
</script>

<template>
  <div class="page">
    <OpenCreatePsychologySessionModal/>
    
    <Calendar 
        :title="'Сессии'"
        :events="sessionStore.events"
        @on-click="onClick"
    >
    </Calendar>
  </div>
</template>

<style lang="scss">
.page {
  & .close {
    opacity: 0.2;
  }
}
</style>