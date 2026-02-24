import type { AxiosResponse } from "axios";
import type { ICreateGroupDto, IGroup } from "@/features/groups/types";
import { axiosInstance } from "@/shared/config/axios";


interface IGroupApi {
    getOne: (groupId: number) => Promise<AxiosResponse<IGroup>>
    create: (dto: ICreateGroupDto) => Promise<AxiosResponse<IGroup>>
    getAll: () => Promise<AxiosResponse<IGroup []>>
}


export const groupApi: IGroupApi = {
    getOne(groupId) {
        return axiosInstance.get(`/student-groups/mentor/${groupId}`)
    },
    create(dto) {
        return axiosInstance.post(`/student-groups`, dto)
    },

    getAll() {
        return axiosInstance.get('/student-groups')
    }
}
