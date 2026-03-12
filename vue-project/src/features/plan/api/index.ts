import type {AxiosResponse} from "axios";
import type {ICreatePlanDto, IPlan, IUpdatePlanDto} from "@/features/plan/types";
import {axiosInstance} from "@/shared/config/axios.ts";


interface IApi {
    getOne: (userId: number) => Promise<AxiosResponse<{id: number, items: string}>>
    getByMe:() => Promise<AxiosResponse<IPlan>>
    create: (dto: ICreatePlanDto) => Promise<AxiosResponse<IPlan>>
    update: (dto: IUpdatePlanDto) => Promise<AxiosResponse<IPlan>>
}


export const planApi: IApi = {
    create(dto) {
        return axiosInstance.post('/plan', dto)
    },
    
    getOne(userId: number) {
        return axiosInstance.get(`/plan/${userId}`)
    },
    
    getByMe() {
        return axiosInstance.get('/plan/user/me')
    },
    
    update(dto) {
        return axiosInstance.patch(`/plan/${dto.id}`, dto)
    }
    
}