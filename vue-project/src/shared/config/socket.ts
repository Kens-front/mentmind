// src/stores/socket.ts
import { useAuthStore } from '@/features/auth/store';
import { useChatStore } from '@/features/chats/api/store';
import { useMessageStore } from '@/features/messages/store';
import type { IMessage } from '@/features/messages/types';
import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
const isDev = false;
 
interface Message {
  from: string;
  text: string;
  at: string;
}

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null as Socket | null,
    connected: false,
  }),

  actions: {
    connect(id: number) {
      if (this.socket) return;

      const messageStore = useMessageStore();
      const authStore = useAuthStore()

      this.socket = io('http://mentmind.ru/api', {
        transports: ['websocket'],
        auth: {
            id,
        },
      });

      this.socket.on('connect', () => {
        this.connected = true;
        console.log('WS connected');
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
        console.log('WS disconnected');
      });

      this.socket.on('message', (payload: IMessage) => {
          const id = authStore.userData.user?.id || 0
          messageStore.addMessage(id, payload)
      });

      this.socket.on('achieve', (payload: IMessage) => {
        alert(payload);
      });

      this.socket.on('messages_read', (data) => {
        this.readMessage(data)
      });
    },

    sendMessage(text: string) {
      if (!this.socket) return;

      this.socket.emit('message', {
        text,
      });
    },

    readMessage(data: any) {
      const messageStore = useMessageStore();
      const chatStore = useChatStore();

      messageStore.messages = messageStore.messages.map(message => {
        if (!message.readAt && message. id <= data.lastMessageId) {
          return {...message, readAt: data.readAt, status: 'read'}
        }

        return message
      }) 

      const foundChat = chatStore.chats.find(chat => chat.id === data.chatId);

      if (foundChat) {
        foundChat.countUnread = '0';
      }
      console.log(data);
    },

    disconnect() {
      this.socket?.disconnect();
      this.socket = null;
      this.connected = false;
    },
  },
});
