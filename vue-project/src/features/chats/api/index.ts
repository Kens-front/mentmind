import type { AxiosResponse } from "axios";
import type { IChat } from "./types";
import { axiosInstance } from "@/shared/config/axios";



interface IChatsApi {
    get: () => Promise<AxiosResponse <IChat []>>
}

export const chatApi: IChatsApi = {
    get() {
        return axiosInstance.get('/chat')
    }
}