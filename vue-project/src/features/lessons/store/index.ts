import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { LESSON_STATUS, type ICreateLessonDto, type ILesson } from "../types";
import { lessonApi } from "../api";
import type { ILessonSlotEvent } from "@/features/mentor-availability/types";
import { axiosInstance } from "@/shared/config/axios";
 
import { translateLessonType } from "../helpers";
import { RoleList } from "@/features/users/types";



export const useLessonStore = defineStore('lesson', () => {

    const lessons = ref<ILesson []>([]);

    const events = computed(() => lessons.value.map(item => {
        const userNames = item.participants?.map(participant => `${participant?.user?.first_name[0]}. ${participant?.user?.last_name}`).join(' - ')
        const newSlot = { 
            title: translateLessonType(item.lessonType),  
            content: `<p>${userNames}</p>`,
            start: new Date(`${item.date}T${item.start_time}`),  
            end: new Date(`${item.date}T${item.end_time}`),
            lessonId: item.id,
            class: generateLessonCssClasses(item),
        } as ILessonSlotEvent
        return newSlot;
    }));

    const updateLesson = reactive({}) as ICreateLessonDto

    async function getAll(query?: {status: string, start_date: string, end_date: string}) {
        const {data} = await lessonApi.get(query)
        lessons.value = data;
    }

    async function getOne(id: number) {
        const {data} = await lessonApi.getOne(id)

        const mentorId = data.participants.find(user => user.role === RoleList.MENTOR)?.userId
        const aLesson = {
            ...data, 
            mentorId: mentorId, 
            duration: `${data.duration} минут`,
            price: data.price,
            lessonType: translateLessonType(data.lessonType)
        };

        Object.assign(updateLesson, aLesson)
    }

    async function create(form: ICreateLessonDto,date: string) {
        return lessonApi.create({...form, date});
    }

    async function update(id: number) {
        const dto = {
            rating: updateLesson.rating,
            notes: updateLesson.notes,
            recordLink: updateLesson.recordLink,
            lessonLink: updateLesson.lessonLink,
            finePercent: updateLesson.finePercent,
            status: updateLesson.status,
            price: updateLesson.price
        }
        await lessonApi.update(id, dto)
    }

    async function completeLesson(id: number) {
        const dto = {
            status: LESSON_STATUS.COMPLETED,
            lessonLink: updateLesson.lessonLink,
            recordLink: updateLesson.recordLink,
            notes: updateLesson.notes
        }

        updateLesson.status = LESSON_STATUS.COMPLETED
        await axiosInstance.patch(`/lesson/${id}`, dto)
    }

    function setLessonData(data: {kind: string, studentIds: number []}) {
        updateLesson.kind = data.kind
        updateLesson.studentIds = data.studentIds
    }


    function generateLessonCssClasses(lesson: ILesson) {
        const isCompleted = lesson.lessonSlots.every(slot => slot.expiresAt) ? 'completed' : '';

        return `${lesson.status} slot-${isCompleted}`
    }
    return {
        lessons,
        updateLesson,
        events,
        create,
        setLessonData,
        getAll,
        getOne,
        update,
        completeLesson,
    }
})