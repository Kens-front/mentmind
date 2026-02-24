import type { AxiosResponse } from "axios";
import type { ILearnDirection } from "../types";
import { axiosInstance } from "@/shared/config/axios";




interface ILearnDirectionApi {
    getAll: () => Promise<AxiosResponse<ILearnDirection []>>
    create: (title: Omit<ILearnDirection, 'id'>) => Promise<AxiosResponse<ILearnDirection>>
    delete: (id: number) => Promise<AxiosResponse<{id: number}>>
    update: (id: number, newLd: {title: string}) => Promise<AxiosResponse<{id: number}>>
}

export const learnDirectionApi: ILearnDirectionApi = {
    getAll() {
        return axiosInstance.get('/learn-direction');
    },

    create(title) {
        return axiosInstance.post('/learn-direction', title)
    }, 

    delete(id) {
        return axiosInstance.delete(`/learn-direction/${id}`)
    },

    update(id, newLd) {
        return axiosInstance.patch(`/learn-direction/${id}`, newLd)
    }
}