import type { AxiosResponse } from "axios";
import type { IUpdateUserFull, IUser, IUserForm, IUserFull, TUserFull, USER_LEVEL } from "../types";
import { axiosInstance } from "@/shared/config/axios";
import type { LESSON_TYPES } from "@/features/lessons/types";



interface IMentor {
    mentorId: number
    learn_directions: number[]
    level: USER_LEVEL
    tags: string
}

interface IStudentProfile {
    learn_direction: number
    lessonFormat: LESSON_TYPES
}

export type TProfile = IMentor & IStudentProfile

interface IUserApi {
    create: (user: IUserForm & (IMentor | IStudentProfile)) => Promise<AxiosResponse<{ user: IUser, profile: TProfile }>>
    getAll: (query: any) => Promise<AxiosResponse<TUserFull[]>>
    update: (id: number, payload: IUpdateUserFull) => Promise<AxiosResponse<{ isOk: true }>>
    getOne: (id: number) => Promise<AxiosResponse<IUserFull>>
    getProfile: () => Promise<AxiosResponse<IUserFull>>
    updateProfileAvatar: (formData: FormData) => Promise<AxiosResponse<IUserFull>>
    updateProfileWithFormData: (id: number, formData: FormData) => Promise<AxiosResponse<{ isOk: true }>>
}


export const userApi: IUserApi = {
    create(user) {
        return axiosInstance.post('/auth/register', user)
    },
    getAll(query) {
        return axiosInstance.get('/user', { params: query })
    },
    update(id, payload) {
        return axiosInstance.patch(`/user/full/${id}`, payload)
    },
    getOne(id) {
        return axiosInstance.get(`/user/full/${id}`)
    },

    getProfile() {
        return axiosInstance.get('/user/profile')
    },

    updateProfileAvatar(formData) {
        return axiosInstance.patch('/user/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    updateProfileWithFormData(id, formData) {
        return axiosInstance.patch(`/user/full/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}