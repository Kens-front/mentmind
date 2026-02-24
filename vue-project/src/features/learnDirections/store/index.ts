import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import type { ILearnDirection } from "../types";
import { learnDirectionApi } from "../api";



export const useLearnDirectionStore = defineStore('learn-direction', () => {
    const learnDirections = ref<ILearnDirection []>([]);


    const updatedDirection = reactive({
        title: '',
    });

    const options = computed(() => learnDirections.value.map(ld => ({...ld, label: ld.title, value: ld.id})))

    async function getAll() {
        const {data} = await learnDirectionApi.getAll();
        learnDirections.value = data;
    }

    async function create(form: {title: string}) {
        const {data} = await learnDirectionApi.create(form)
        learnDirections.value.push(data);

        reset();
    }

    async function deleteOne(id: number) {
        await learnDirectionApi.delete(id);
        learnDirections.value = learnDirections.value.filter(ld => ld.id !== id);
    }

    async function edit(id: number) {
        await learnDirectionApi.update(id, {...updatedDirection})

        const foundDirection = learnDirections.value.find(ld => ld.id === id)

        if (!foundDirection) {
            throw new Error('Не найдено направление')
        }

        foundDirection.title = updatedDirection.title;
        
        reset();
    }

    function reset() {
        updatedDirection.title = ''
    }

    function setDefaultTitle(id: number) {
        const ld = learnDirections.value.find(item => item.id === id);

        if (!ld) {
            return;
        }


        updatedDirection.title = ld?.title;
    }

    return {
        learnDirections,
        updatedDirection,
        options,
        getAll,
        create,
        reset,
        deleteOne,
        edit,
        setDefaultTitle,
    }
})