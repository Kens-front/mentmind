import type { AxiosResponse } from "axios";
import type { ILogin, ILoginResponse, IValidateData } from "../types";
import { axiosInstance } from "@/shared/config/axios";






interface IAuthApi {
    login: (loginData: ILogin) => Promise<AxiosResponse<ILoginResponse>>

    validate: () => Promise<AxiosResponse<IValidateData>>

    logout: () => Promise<AxiosResponse>
}


export const authApi: IAuthApi = {
    login(loginData) {
        return axiosInstance.post('/auth/login', loginData);
    },

    validate() {
        return axiosInstance.get('/auth/validate');
    },

    logout() {
        return axiosInstance.post('/auth/logout')
    },
}