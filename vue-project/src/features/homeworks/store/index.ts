import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { EHomeworkStatus, ICreateHomeworkDto, IHomework } from "../types";
import { homeworkApi } from "../api";


export const useHomeWorkStore = defineStore('homework', () => {
    const homeworks = ref<IHomework []>([])
    const homework = reactive({}) as IHomework

    async function getAll() {
        const {data} = await homeworkApi.get()
        homeworks.value = data
    }

    async function getOne(homeworkId: number) {
        const {data} = await homeworkApi.getOne(homeworkId)
        Object.assign(homework, data);
    }

    async function create(dto: ICreateHomeworkDto) {
        const {data} = await homeworkApi.create({...dto, initialCode: homework.initialCode})
        homeworks.value.push(data)
    }

    async function update(id: number, dto: Partial<ICreateHomeworkDto & {status: EHomeworkStatus}>) {
        const {data} = await homeworkApi.update(id, dto)
        Object.assign(homework, data);
    }
    return {
        homeworks,
        homework,
        getAll,
        create,
        getOne,
        update
    }
})