<template>
    <div class="calendar-page">
      <transition name="fade" mode="out-in">
        <Calendar
            title="Занятия"
            :events="lessonStore.events"
            :editable="false"
            @on-ready="onReady($event.view)"
            @on-view-change="onReady"
            @on-click="openLessonPage($event.event)"
        />
      </transition>
    </div>
</template>


<script setup lang="ts">
import { useLessonStore } from '@/features/lessons/store';
import Calendar from '@/shared/ui/Calendar.vue';
import {onMounted, reactive, ref, watchEffect, type Reactive, computed} from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const lessonStore = useLessonStore()
const query = reactive<{extendedStart: null | Date, extendedEnd: null | Date}>({extendedStart:null, extendedEnd: null}) 

const key = computed(() => {
  return lessonStore.events.reduce((acc, event) => {
    return acc + event.class;
  }, '')
})
function onReady(event: any) {
    query.extendedStart = event.extendedStart
    query.extendedEnd = event.extendedEnd
}

function openLessonPage(event: any) {
  requestAnimationFrame(() => {
    router.push(`/lessons/${event.lessonId}`)
  })
}

watchEffect(async () => {
    try {
        const start = query.extendedStart
        const end = query.extendedEnd
        if(!start || !end) {
            return;
        }

        lessonStore.getAll({start_date: start.toISOString().slice(0, 10), end_date: end.toISOString().slice(0, 10), status: ''})
    } catch {

    }
})

onMounted(() => {
    try {
        const start = query.extendedStart
        const end = query.extendedEnd
        if(!start || !end) {
            return;
        }

        lessonStore.getAll({start_date: start.toISOString().slice(0, 10), end_date: end.toISOString().slice(0, 10), status: ''})
    } catch {

    }
})
</script>

<style lang="scss" scoped>
.calendar-page {
  display: grid;
  grid-template-rows: 100%;
  height: 100%;
}

.vuecal--default-theme  {
    height: 100%;
}
</style>