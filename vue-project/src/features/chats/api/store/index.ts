import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { IChat } from "../types";
import { chatApi } from "..";


export const useChatStore = defineStore('chat', () => {
    const chats = ref<IChat[]>([])


    const unreadMessagesCount = computed(() => chats.value.reduce((acc, chat) => Number(chat.countUnread) + acc, 0))

    function changeUnreadCountMessage(chatId: number) {
        const chat = chats.value.find((item) => item.id === chatId)
            console.log('test1', chatId)
        if (chat && typeof chat.countUnread === 'string') {
            console.log('test')
            chat.countUnread = `${Number(chat.countUnread) + 1}`
        }
    }
    async function getAll() {
        const { data } = await chatApi.get();

        chats.value = data;
    }

    return {
        chats,
        unreadMessagesCount,
        getAll,
        changeUnreadCountMessage
    }
})