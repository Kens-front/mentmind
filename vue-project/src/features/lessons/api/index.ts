import type { AxiosResponse } from "axios";
import type { ICreateLessonDto, ILesson, IUpdateLessonDto } from "../types";
import { axiosInstance } from "@/shared/config/axios";
 



interface ILessonApi {
    create: (lessonDto: ICreateLessonDto) => Promise<AxiosResponse<ILesson>>
    get: (query?: {status: string, start_date: string, end_date: string}) => Promise<AxiosResponse<ILesson[]>>
    getOne: (id: number) => Promise<AxiosResponse<ILesson>>
    update: (id: number, dto: IUpdateLessonDto) => Promise<AxiosResponse<ILesson>>
}

export const lessonApi: ILessonApi = {
    create(lessonDto) {
        return axiosInstance.patch('/lesson/planned', lessonDto)
    },

    get(query) {
        return axiosInstance.get('/lesson', {params: query})
    },

    getOne(id) {
        return axiosInstance.get(`/lesson/${id}`)
    },

    update(id: number, dto: IUpdateLessonDto) {
        return axiosInstance.patch(`/lesson/${id}`, dto)
    }
}