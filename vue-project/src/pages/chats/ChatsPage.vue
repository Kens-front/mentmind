<template>
    <div class="page">
        <div>
            <h1>Чаты</h1>
        </div>

        <EmptyContainer>
            <div v-if="chatStore.chats.length" class="list">
                <ChatItem 
                    v-for="chat of chatStore.chats"
                    :key="chat.id"
                    :chat="{
                      ...chat,
                      countUnread: Number(chat.countUnread),
                       chatId: chat.id, 
                       'lastActivity.time': '', 
                       'lastActivity.timestamp': '',
                        isFixedBottom:false, 
                        'lastMessage.status': '',
                        status: '',
                        typing: false,
                        metadata: '',
                        dialogsExpanded: false,
                        isSelected: false,
                        lastMessage: getMessageText(chat)
                    }"
                    @select="openChatPage($event.chat)"
                    />
            </div>
        </EmptyContainer>
    </div>
</template>

<script lang="ts" setup>
import { useChatStore } from '@/features/chats/api/store';
import type { IChat } from '@/features/chats/api/types';
import EmptyContainer from '@/widgets/common/EmptyContainer.vue';
import { BaseContainer, ChatItem } from '@mobilon-dev/chotto';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
 
const router = useRouter();
const chatStore = useChatStore();

function getMessageText(chat: IChat) {
    if (!chat.lastMessage) {
        return 'В этом чате ещё нет сообщений'
    }

    return chat.lastMessage;
}

function openChatPage(chat: any) {
    router.push(`/chats/${chat.id}`)
}
onMounted(() => {
    try {
        chatStore.getAll();
    } catch {

    }
})
</script>
<style lang="scss" scoped>
.card {
    position: relative;
}
.chat {
    display: grid;
    row-gap: .4rem;
}
.page {
    display: grid;
    grid-template-rows: max-content 1fr;
    row-gap: 1rem;
    height: 100%;
}

.link {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.list {
 
}
</style>