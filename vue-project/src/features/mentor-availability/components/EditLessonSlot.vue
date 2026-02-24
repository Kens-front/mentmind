<template>
    <el-form
        ref="formRef"
        class="form"
        label-position="top"
        :rules="rules"
        :model="edited"
        @submit.prevent="save"
    >
      <div class="inputs">
        <el-form-item prop="start" label="Начало занятия">
          <el-input v-model="edited.start" v-maska="'##:##'" placeholder="Начало (HH:mm)" />
        </el-form-item>

        <el-form-item prop="end" label="Конец занятия">
          <el-input v-model="edited.end" v-maska="'##:##'" placeholder="Конец (HH:mm)" />
        </el-form-item>

      </div>
  
      <el-form-item label="Дата занятия">
        <el-date-picker v-model="edited.date" type="date" />
      </el-form-item>
  
      <div class="actions">
        <el-button type="primary" native-type="submit" :disabled="isDisabled">Сохранить</el-button>
        <el-button type="danger" @click="deleteOne">Удалить</el-button>
        <el-button @click="emits('close')">Отмена</el-button>
      </div>
    </el-form>
  </template>
  
  <script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useMentorAvailabilityStore } from '../store'
import type { ILessonSlotEvent } from '../types'
import { parseToDto } from '@/shared/helpers';
import { notifySuccess } from '@/shared/config/notifications';
import type { FormInstance, FormRules } from 'element-plus';
 

interface IProps {
  slot: ILessonSlotEvent
}

interface RulesForm {
  start: string
  end: string
  date: string
}
const props = defineProps<IProps>()
const emits = defineEmits(['close'])

const formRef = ref<FormInstance>();
const slotStore = useMentorAvailabilityStore()

const rules = reactive<FormRules>({
  start: [
    {required: true, message: 'Обязательное поле',}
  ],
  end: [
    {required: true, message: 'Обязательное поле',}
  ],
})

// createLessonSlot(slot) — судя по названию, возвращает DTO со строками start/end
const dto = parseToDto(props.slot)

const edited = reactive<RulesForm>({
  start: dto.start as string, // 'HH:mm'
  end: dto.end as string,     // 'HH:mm'
  date: props.slot._.startFormatted
})

const isDisabled = computed(() => {
  const condition = edited.start.length < 5 || edited.end.length < 5;
  const startHours = edited.start.split(':')[0]
  const endHours = edited.end.split(':')[0]

  const startMinutes = edited.start.split(':')[1]
  const endMinutes = edited.end.split(':')[1]
  if (Number(startHours) > 24 || Number(endHours) > 59) {
    return true;
  }

  if (Number(startMinutes) > 59 || Number(endMinutes) > 59) {
    return true;
  }

  if (Number(startHours) > Number(endHours)) {
    return true
  }

  return condition
})

async function save() {
  try {
    if (isDisabled.value) {
    return;
  }

  await slotStore.editWorkingSlot({
    id: props.slot._.id,
    date: props.slot._.startFormatted,
    start: edited.start,
    end: edited.end,
  })
  notifySuccess('Слот успешно изменён')
  emits('close')
  } catch {

  }
}

function deleteOne() {
  slotStore.deleteSlot(props.slot._.id)
  emits('close')
}
</script>