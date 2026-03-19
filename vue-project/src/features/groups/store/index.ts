import { defineStore } from "pinia";
import { ref } from "vue";
import type { ICreateGroupDto, IGroup } from "../types";
import { groupApi } from "../api";



export const useGroupStore = defineStore('group', () => {
    const groups = ref<IGroup []>([])


    async function getOne(groupId: number) {
        return groupApi.getOne(groupId)
    }

    async function getAll() {
        const {data} = await groupApi.getAll()
        groups.value = data
    }

    async function create(dto: ICreateGroupDto) {
        const {data} = await groupApi.create(dto)
        groups.value.push(data)
    }

    async function deleteOne(id: number) {
        const {data} = await groupApi.delete(id)
        groups.value = groups.value.filter(d => d.id !== id)
    }

    return {
        groups,
        getOne,
        create,
        getAll,
        deleteOne
    }
})