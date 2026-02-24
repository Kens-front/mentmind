<template>
    <div class="layout">  
      <Aside/>

 
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
import { onMounted, watch } from 'vue';

const auth = useAuthStore();
const chatStore = useChatStore()
const socket = useSocketStore();

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
    grid-template-columns: 1fr 4fr;
    grid-template-areas: 'aside main';
    height: 100vh;
  }
  
  .main {
    padding: 2rem;
    height: inherit;
    background: var(--surface);

  }

 
  </style>
  