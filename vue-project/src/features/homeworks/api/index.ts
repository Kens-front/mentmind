import type { AxiosInstance, AxiosResponse } from "axios";
import type { ICreateHomeworkDto, IHomework } from "../types";
import { axiosInstance } from "@/shared/config/axios";



interface IHomeworkApi {
    get: () => Promise<AxiosResponse<IHomework []>>
    getOne: (homeworkId: number) => Promise<AxiosResponse<IHomework>>
    create: (dto: ICreateHomeworkDto) => Promise<AxiosResponse<IHomework>>
    update: (id: number, dto: Partial<ICreateHomeworkDto>) => Promise<AxiosResponse<IHomework>>
}

export const homeworkApi: IHomeworkApi = {
    create(dto) {
        return axiosInstance.post('/homework', dto)
    },

    get() {
        return axiosInstance.get('/homework')
    },

    getOne(homeworkId) {
        return axiosInstance.get(`/homework/${homeworkId}`)
    },

    update(id, dto) {
        return axiosInstance.patch(`/homework/${id}`, dto)
    },
}