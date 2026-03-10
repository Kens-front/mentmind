import type {AxiosResponse} from "axios";
import type {IStudentPayout} from "@/features/payments/types";
import type {IUpdateRequestMetrika} from "@/features/request/types";
import {axiosInstance} from "@/shared/config/axios.ts";

interface IApi {
    get: (filter: any) => Promise<AxiosResponse<[IStudentPayout [], number]>>
    update: (dto: IUpdateRequestMetrika) => Promise<AxiosResponse<[IStudentPayout [], number]>>
}

export const requestApi: IApi = { 
    get(filter) {
        return axiosInstance.get('/request', {params: {...filter}})
    },
    
    update(dto) {
        return axiosInstance.patch(`/request/${dto.id}`, dto)
    }
}
