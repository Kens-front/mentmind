import type {ICreatePsychologySessionDto, IPsychologySession} from "@/features/psychology-sessions/types";
import type {AxiosResponse} from "axios";
import {axiosInstance} from "@/shared/config/axios.ts";


interface IApi {
    create: (dto: ICreatePsychologySessionDto) => Promise<AxiosResponse<IPsychologySession>>
    get: () => Promise<AxiosResponse<IPsychologySession []>>
}

export const psychologySessionApi: IApi = {
    create(dto) {
        return axiosInstance.post('/psychology-session', dto)
    }, 
    
    get() {
        return axiosInstance.get('/psychology-session')
    }
}