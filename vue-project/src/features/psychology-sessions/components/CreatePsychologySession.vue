<script setup lang="ts">
import {RoleList, type TUserFull} from "@/features/users/types";
import {computed, onMounted, reactive, ref} from "vue";
import {userApi} from "@/features/users/api";
import {usePsychologySessionStore} from "@/features/psychology-sessions/store";

const emits = defineEmits(['close'])
const psychologySessionStore = usePsychologySessionStore();

const students = ref<TUserFull []>([])

const sessionData = reactive({
  date: '',
  userId: null,
})


const sessionDto = computed(() => {
    const date = sessionData.date.split(' ')[0] || '';
    const time = sessionData.date.split(' ')[1] || '';
  
    return {
      date,
      time,
      userId: sessionData.userId,
    }
})

async function createSession(): Promise<void> {
  try {
    if (sessionDto.value.date && sessionDto.value.time) {
      await psychologySessionStore.createPsychologySessions(sessionDto.value)
    }
    
    emits('close');
  } catch {
    console.error("Error creating session", sessionDto.value)
  }
}
async function getUsers(){
  try {
    const {data} = await userApi.getAll({role: RoleList.STUDENT})
    students.value = data
  } catch {

  }
}

async function getSessions() {
  try {
     
  } catch {
    
  }
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <div>
    <el-form label-position="top"  class="content">
      <el-form-item label="Дата">
        <el-date-picker
            v-model="sessionData.date"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
          />
      </el-form-item>

      <el-form-item label="Студент">
        <el-select v-model="sessionData.userId">
          <el-option
              v-for="student of students"
              :key="student.id"
              :label="student.fullname"
              :value="student.id"
          />
        </el-select>
      </el-form-item>
      
      <el-button @click="createSession">
        Создать
      </el-button>
    </el-form>

  </div>
</template>

<style scoped lang="scss">
.content {
  display: grid;
}
</style>