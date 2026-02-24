<template>
    <div class="page">
         <div class="chat" ref="scrollRoot">
            <el-scrollbar ref="scroll">
                <div class="list" data-cy="message-list">
                    <div
                        v-for="value of messageStore.messages"
                        :key="value.id"
                        :ref="(el) => register(el as Element | null, value.id)"
                    >
                        <text-message 
                            :message-id="value.id"
                            :message="{...value, messageId: value.id, messageStatus: value.status, avatar: generateImageUrl(authStore.userData?.user?.avatar || undefined)}"
                            :reactions-enabled="false"
                            data-cy="message-item"
                        />
                    </div>
                </div>
            </el-scrollbar>
            <chat-input data-cy="chat-input" @send="onSend"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useGetMessages } from '@/features/common/composables/get-messages.composable';
import { useMessageStore } from '@/features/messages/store';
import type { ICreateMessageDto } from '@/features/messages/types';
import { notifySuccess } from '@/shared/config/notifications';
import { generateImageUrl, scrollToBottom } from '@/shared/helpers';
import { ChatInput, TextMessage } from '@mobilon-dev/chotto';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMessageReadObserver } from '@/features/common/composables/useMessageReadObserver';
import { useAuthStore } from '@/features/auth/store';

const route = useRoute()

const scroll = ref<(HTMLElement & {wrapRef: HTMLElement}) | null>(null);
const scrollRoot = ref<(HTMLElement) | null>(null);
const id = route.params.id;
const {getMessages} = useGetMessages()
const messageStore = useMessageStore()
const authStore = useAuthStore()


async function onSend(message:ICreateMessageDto) {
    try {
        await messageStore.create(Number(id), message.text);
        notifySuccess('Сообщение отправлено')
    } catch {

    }
}


function sendRead(lastMessageId: number) {

    if (typeof id === 'string') {
        messageStore.readMessages(Number(id), lastMessageId)
        console.log("READ:", lastMessageId);
    }
 
}

const isOwn = (messageId: number) => {
  const m = messageStore.messages.find((x) => x.id === messageId);
  return m ? m.sender.id === authStore.userData.user?.id : false;
};

const { register, unobserveAll } = useMessageReadObserver(sendRead, {
  root: scrollRoot.value, // ВАЖНО: сначала будет null (см. onMounted ниже)
  threshold: 1,
  rootMargin: "0px 0px 15% 0px",
  debounceMs: 250,
  isOwnMessage: isOwn,
});

watch(() => messageStore.messages, async () => {
    await nextTick();
    if(scroll.value) {
        scrollToBottom(scroll.value.wrapRef);
    }
}, {deep: true, flush: 'post'})
 
onMounted(async () => {
    await nextTick();
    try {
        getMessages(Number(id))
    } catch {

    }
})
</script>
<style lang="scss" scoped>
.page {
    display: grid;
    grid-template-rows: 100%;
    height: calc(100vh - 4rem);
}

.chat {
    display: grid;
    grid-template-rows: 1fr max-content;
    height: 100%;
}

.list {
    padding: 0 2rem;
}
</style>