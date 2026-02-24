import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { IChat } from "../types";
import { chatApi } from "..";


export const useChatStore = defineStore('chat', () => {
    const chats = ref<IChat[]>([])


    const unreadMessagesCount = computed(() => chats.value.reduce((acc, chat) => Number(chat.countUnread) + acc, 0))
    async function getAll() {
        const { data } = await chatApi.get();

        chats.value = data;
    }

    return {
        chats,
        unreadMessagesCount,
        getAll,
    }
})