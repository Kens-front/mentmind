<template>
    <el-form @submit.prevent="onSubmit" class="form" label-position="top">
        <div class="inputs">
            <el-form-item label="Ссылка на занятие"> 
                <el-input 
                    v-model="form.lessonLink"
                    placeholder="https://link.ru"
                />
             </el-form-item>

             <el-form-item v-if="!mentorId" label="Ментор"> 
                <el-select 
                    v-model="form.mentorId" 
                    placeholder="Выбрать ментора" 
                    data-cy="learn-direction-select"
                >
                    <el-option
                        v-for="item of mentors"
                        :key="item.id"
                        :label="item.fullname"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="Комментарий" class="textarea"> 
                <el-input v-model="form.notes" type="textarea" placeholder="Необходимая дополнительная информация"/>
            </el-form-item>
        </div>

        <div class="date">
            <el-form-item label="Начало занятия"> 
                <el-select
                    v-model="form.start_time"
                    placeholder="12:00" 
                    data-cy="learn-direction-select"
                    :disabled="!enabledTime.length"
                >
                    <el-option
                        v-for="item of enabledTime"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="Дата"> 
                <el-date-picker-panel 
                    v-model="mentorAvailability.activeDate"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    type="date"
                    :disabled-date="disableDate"
                    @panel-change="($event:any, $event2: any) => {
                        date = formatDate($event)
                        console.log($event2)
                    }"
                />
            </el-form-item>

            <div>
                <el-button :disabled="disabledSubmit" native-type="submit">Создать</el-button>
                <el-button @click="emits('close')">Отмена</el-button>
            </div>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
 
import { RoleList,  type TUserFull } from '@/features/users/types';
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { useLessonStore } from '../store';
import { useMentorAvailabilityStore } from '@/features/mentor-availability/store';
import { useMentorEnableHours } from '@/features/mentor-availability/composables';
import { userApi } from '@/features/users/api';
import { notifySuccess } from '@/shared/config/notifications';
import { useLessonSlotStore } from '@/features/lesson-slots/store';
import type { AxiosResponse } from 'axios';
import type { ICreateLessonDto } from '../types';
import { useLessonPackageStore } from '@/features/lesson-package/store';
import {useUserStore} from "@/features/users/store/store.ts";
interface IProps {
    kind: string
    studentIds?: number []
    mentorId?: number
}

const {kind, studentIds = [], mentorId} = defineProps<IProps>()
const emits = defineEmits(['close']);

const date = ref<string>(formatDate(new Date()));
 
const lessonStore = useLessonStore()
const lessonPackageStore = useLessonPackageStore();
const mentorAvailability = useMentorAvailabilityStore();
const userStore = useUserStore();
const {enabledTime} = useMentorEnableHours();

const form = reactive({
    lessonLink: '',
    kind,
    studentIds,
    notes: '',
    date: '',
    start_time: '',
    mentorId,
}) as ICreateLessonDto

const mentors = ref<TUserFull[]>([])

const disabledSubmit = computed(() => {
    const fields: (keyof typeof form) [] = ['lessonLink', 'start_time', 'mentorId'];

    return !fields.every(field => form[field])
});


function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function disableDate(date: Date) {
    // if (date.getTime() === 1759428000000) {
    //     return false
    // }
    // return true

    return !mentorAvailability.slotsByDate.includes(date.getTime())
    //console.log(mentorAvailability.slotsByDate[0] === date.getTime())
}
async function onSubmit() {
    try {
        await lessonStore.create(form, mentorAvailability.activeDate)
        const lessonsUser = userStore.users.find(user => form.studentIds.includes(user.id));
        
        if (lessonsUser && lessonsUser.availableLessons) {
          --lessonsUser.availableLessons
        }
        notifySuccess('Занятие успешно создано')
        emits('close')
    } catch {

    }
}


watchEffect(() => {
  const mentorId = form.mentorId
  if (!mentorId || !date.value) return

  mentorAvailability.getSlotsByMentorId(mentorId, { date: date.value })
})


onMounted(async () => {
    try {
 
        let requests: Promise<void | AxiosResponse<TUserFull []>> [] = [userApi.getAll({role: RoleList.MENTOR})]

        if (kind !== 'trial') {
            requests = [...requests, lessonPackageStore.getOne(studentIds)]
  
        }
        const [mentorItems] = await Promise.all(requests)
 
        if (mentorItems?.data) {
            mentors.value = mentorItems.data
        }
    } catch {

    }
})

 
</script>

<style lang="scss" scoped>
    .date {
        display: grid;
    }

    .form {
        display: grid;
        grid-template-columns: 1fr max-content;
        column-gap: 1rem;
        justify-content: space-between;
    }
    
    .inputs {
        display: grid;
        grid-auto-rows: max-content;
    }
    
    .time {
        width: 100%;
    }

    .textarea {
        height: 100%;
    }
</style>
    