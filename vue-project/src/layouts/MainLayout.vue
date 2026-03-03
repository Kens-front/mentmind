<template>
    <div class="layout">  
      
      <Header @click="onClick"/>
      <Aside :theme="isDarkTheme" @click:close-aside="onClick"/>

 
      <main class="main">
        <BaseContainer>
          <el-scrollbar>
              <RouterView />
          </el-scrollbar>
        </BaseContainer>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
import { useAuthStore } from '@/features/auth/store';
import { useChatStore } from '@/features/chats/api/store';
import { useSocketStore } from '@/shared/config/socket';
import Aside from '@/widgets/Aside.vue';
import { BaseContainer } from '@mobilon-dev/chotto';
import {onMounted, ref, watch} from 'vue';
import Header from "@/widgets/Header.vue";
import {useUserStore} from "@/features/users/store/store.ts";

const auth = useAuthStore();
const user = useUserStore();
const chatStore = useChatStore()
const socket = useSocketStore();

const isDarkTheme = ref(false);

function onClick(value?: boolean) {
  isDarkTheme.value = value ?? !isDarkTheme.value;
}
onMounted(() => {
  const id = auth.userData.user?.id
  if (id) {
    socket.connect(id);
  }

  Promise.allSettled([ chatStore.getAll()])
});

watch(
  () => auth.userData.user?.id,
  (id) => {
    if (id) socket.connect(id);
    else socket.disconnect();
  },
  { immediate: true }
);

  </script>
  
  <style lang="scss" scoped>
  .layout {
    display: grid;
    grid-template-columns: 1fr 5fr;
    grid-template-areas: 'aside main';
    height: 100vh;
    
    @media screen and (max-width: 1024px) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'header'
        'main';
    }
  }
  
  .main {
    padding: 2rem;
    height: inherit;

    & .base-container {
      min-width: 100%;
    }
  }

 
  </style>
  