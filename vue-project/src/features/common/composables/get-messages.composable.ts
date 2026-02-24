import { useAuthStore } from "@/features/auth/store";
import { useMessageStore } from "@/features/messages/store";
import { createMessageTime, normalizeMessage } from "@/shared/helpers";



export function useGetMessages() {
    const authStore = useAuthStore()
    const messageStore = useMessageStore()

    const getMessages = async (id: number) => {
        const userId = authStore.userData.user?.id ?? 0;
        await messageStore.getAll(id);

        messageStore.messages = messageStore.messages.map(message => normalizeMessage(userId, message))
    }
    return {getMessages}
}   