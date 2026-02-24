import { axiosInstance } from "@/shared/config/axios";
import type { AxiosResponse } from "axios";

export interface ILessonPackage {
    id: number
    duration: number
    totalCount: number
    usedCount: number
    status: string
    userId: number
    createAt: string
  }
  


interface ILessonPackageApi {
    get: (ids: number[]) => Promise<AxiosResponse<ILessonPackage>>
    addBonus: (userId: number) => Promise<AxiosResponse<ILessonPackage>>
}

export const lessonPackageApi: ILessonPackageApi = {
    get(ids) {
        return axiosInstance.get(`/lesson-package/`,{params: {userIds: ids}})
    },

    addBonus(userId) {
        return axiosInstance.patch(`/lesson-package/bonus/${userId}`)
    },
}