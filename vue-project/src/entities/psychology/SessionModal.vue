<script setup lang="ts">
import type {RoleList} from "@/features/users/types";
import {computed, reactive} from "vue";
import {usePsychologySessionStore} from "@/features/psychology-sessions/store";
import {notifySuccess} from "@/shared/config/notifications.ts";

interface Props {
  id: number
  time: string
  date: string
  link: string
  role: RoleList
}

const {time, date, link, role, id} = defineProps<Props>()
const sessionStore = usePsychologySessionStore();
const emits = defineEmits(['close'])
const data = reactive({
  time,
  date,
  link,
})
const isStudent = computed(() => role === 'student')

async function updateSession() {
  try {
    await sessionStore.updatePsychologySession(id, data)
    notifySuccess('Сохранение прошло успешно')
    emits('close')  
  } catch {}
  
}

async function passSession() {
  try {
    await sessionStore.updatePsychologySession(id, {status: 'close'})
    notifySuccess('Сохранение прошло успешно')
    emits('close')
  } catch {}
}
</script>

<template>
  <el-form label-position="top">
    <el-form-item label="Время">
      <el-input v-model="data.time" :readonly="isStudent" />
    </el-form-item>

    <el-form-item label="Дата">
      <el-input v-model="data.date" :readonly="isStudent" />
    </el-form-item>

    <el-form-item label="Ссылка на сессию">
      <el-input v-model="data.link" :readonly="isStudent" />
    </el-form-item>

    <el-button v-if="!isStudent" @click="updateSession">
      Сохранить
    </el-button>
    
    <el-button v-if="!isStudent" @click="passSession">
      Провести
    </el-button>
  </el-form>
</template>

<style scoped lang="scss">

</style>