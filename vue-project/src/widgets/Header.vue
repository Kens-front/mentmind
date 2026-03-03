<script setup lang="ts">
import {More, UserFilled} from "@element-plus/icons-vue";
import {useAuthStore} from "@/features/auth/store";
import {computed} from "vue";
import {generateImageUrl} from "@/shared/helpers";
const authStore = useAuthStore()
const emits = defineEmits(['click']);
const avatar = computed(() => authStore.userData.user?.avatar ? generateImageUrl(authStore.userData.user.avatar) : '');

const onClick = () => {
  emits('click');
}
</script>

<template>
  <el-header class="header">
    <div class="info">
      <div class="avatar">
        MENTMIND
      </div>
    </div>

    <div @click="onClick">
      <el-icon><More /></el-icon>
    </div>
  </el-header>
</template>

<style scoped lang="scss">
.header {
  grid-area: header;
  display: none;
  align-items: center;
  justify-content: space-between;
  
  @media screen and (max-width: 1024px) {
    display: flex;
  }
}

.info {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 1rem;
}
</style>