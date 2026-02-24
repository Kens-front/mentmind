import type { AxiosResponse } from "axios";
import type { ICreateMessageDto, IMessage } from "../types";
import { axiosInstance } from "@/shared/config/axios";



interface IMessageApi {
    get: (chatId: number) => Promise<AxiosResponse<IMessage []>>
    create: (message: ICreateMessageDto) => Promise<AxiosResponse<IMessage>>
    read: (chatId: number, lastMessageId: number) => Promise<AxiosResponse<IMessage>>
}

export const messageApi: IMessageApi = {
    get(chatId) {
        return axiosInstance.get(`/messages/chat/${chatId}`)
    },

    create(message) {
        return axiosInstance.post(`/messages`, message)
    },

    read(chatId, lastMessageId) {
        return axiosInstance.patch(`/messages/read`, {chatId, lastMessageId})
    },
}