import type { AxiosResponse } from "axios";
import type { ILessonSlot } from "../types";
import { axiosInstance } from "@/shared/config/axios";



interface ILessonSlotApi {
    get: (query: {userIds: number []}) => Promise<AxiosResponse<ILessonSlot []>>
    update: (id: number, dto: {reason: string}) => Promise<AxiosResponse<ILessonSlot>>
}

export const lessonSlotApi: ILessonSlotApi = {
    get(query) {
        return axiosInstance.get(`/lesson-credits/by-filter`, {params: {userIds: [query.userIds]}})
    },

    update(id, dto) {
        return axiosInstance.patch(`/lesson-slots/${id}`, dto)
    }
}