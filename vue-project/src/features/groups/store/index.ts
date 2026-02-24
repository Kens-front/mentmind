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

    return {
        groups,
        getOne,
        create,
        getAll
    }
})