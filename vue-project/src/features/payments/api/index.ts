import type { AxiosResponse } from "axios";
import type { IStudentPayout } from "../types";
import { axiosInstance } from "@/shared/config/axios";


interface IStudentPaymentApi {
    get: (filter: any) => Promise<AxiosResponse<[IStudentPayout [], number]>>
}


export const studentPaymentApi: IStudentPaymentApi = {
    get(filter: any) {
        return axiosInstance.get('/payment', {params: filter})
    },
}