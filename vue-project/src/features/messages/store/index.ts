import { defineStore } from "pinia";
import { ref } from "vue";
import type { ICreateMessageDto, IMessage } from "../types";
import { messageApi } from "../api";
import { createMessageTime, normalizeMessage } from "@/shared/helpers";



export const useMessageStore = defineStore('message', () => {
    const messages = ref<IMessage[]>([])
 


    async function getAll(id: number) {
        const {data} = await messageApi.get(id)
 
        messages.value = data
    }


    async function create(chatId: number, text: string) {
        const { data } = await messageApi.create({chatId, text})
    }

    async function readMessages(chatId: number, lastMessageId: number) {
        const { data } = await messageApi.read(chatId, lastMessageId)
    }

    function addMessage(userId: number, aMessage: IMessage) {
        const message = normalizeMessage(userId, aMessage);
        messages.value.push(message)
    }

    return {
        messages, 
        getAll,
        create,
        addMessage,
        readMessages
    }
})