import type { AxiosResponse } from "axios";
import type {ICalculatePayment, ICreatePaymentDto, IStudentPayout} from "../types";
import { axiosInstance } from "@/shared/config/axios";
 

interface IStudentPaymentApi {
    get: (filter: any) => Promise<AxiosResponse<[IStudentPayout [], number]>>
    calculatePayment: (query: ICalculatePayment) => Promise<AxiosResponse<{amount: number, description: string}>>
    create: (body: ICreatePaymentDto) => Promise<AxiosResponse<any>>
}


export const studentPaymentApi: IStudentPaymentApi = {
    get(filter: any) {
        return axiosInstance.get('/payment', {params: filter})
    },
    
    calculatePayment(query) {
        return axiosInstance.get('/payment/calculate', {params: query})
    },
    
    create(body){
        const idempotencyKey = crypto.randomUUID();
        return axiosInstance.post('/payment', body, {headers: {'idempotency-key': idempotencyKey}})
    }
}