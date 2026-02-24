import { defineStore } from "pinia";
import { lessonPackageApi, type ILessonPackage } from "../api";
import { ref, type Ref } from "vue";

export const useLessonPackageStore = defineStore('lesson-package', () => {
    const lessonPackage = ref({}) as Ref<ILessonPackage>


    async function getOne(ids: number []) {
        const {data} = await lessonPackageApi.get(ids)
        lessonPackage.value = data
    }
    return {
        lessonPackage,
        getOne
    }
})