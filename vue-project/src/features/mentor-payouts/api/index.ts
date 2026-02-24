import type { AxiosResponse } from "axios";
import type { IMentorPayout } from "../types";
import { axiosInstance } from "@/shared/config/axios";



interface IMentorPayoutApi {
    get: (filter: any) => Promise<AxiosResponse<[IMentorPayout [], number]>>
    update: (payoutId: number, dto: Partial<IMentorPayout>) => Promise<AxiosResponse<IMentorPayout>>
    paidSome: (dto: {start_date: string, end_date: string, mentorId: number}) => Promise<AxiosResponse<IMentorPayout []>>
}

export const mentorPayoutApi: IMentorPayoutApi = {
    get(filter) {
        return axiosInstance.get('/mentor-payout', {params: filter})
    },
    update(payoutId, dto) {
        return axiosInstance.patch(`/mentor-payout/${payoutId}`, dto)
    },

    paidSome(dto) {
        return axiosInstance.patch('/mentor-payout', dto)
    },
}