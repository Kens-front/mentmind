<template>
    <aside class="aside">
        <div class="logo">
          <span>MentMind</span>

          <div class="info">
            <div class="avatar">
              <el-avatar :icon="UserFilled" :src="avatar" />
            </div>
 

              <span>
                {{ authStore.userData.user?.first_name }}
              </span>
            </div>
        </div>

        <el-scrollbar>
          <ul>
            <li v-for="value of navigation">
                <RouterLink v-if="value.href !== Navigation.CHATS || !chatStore.unreadMessagesCount" active-class="active" :to="value.href">
                  <el-icon><component :is="value.icon"/></el-icon>
                  <span>{{ value.label }}</span>
                </RouterLink>

                <RouterLink v-else active-class="active" :to="value.href">
                  <el-icon><ChatLineRound /></el-icon>

                  <el-badge :is-dot ="chatStore.unreadMessagesCount" class="item">
                    <RouterLink active-class="active" class="badge" :to="value.href">{{ value.label }}</RouterLink>
                  </el-badge>
                </RouterLink>
            </li>

            <li>
              <a>
                <el-switch
                    v-model="userStore.theme"
                    active-text="Темная тема"
                    size="small"
                />
              </a>
            </li>
            
            <li>
                <RouterLink @click.prevent="onClick" to="">Выйти</RouterLink>
            </li>
          </ul>
        </el-scrollbar>
 
    </aside>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/features/auth/store';
import { useChatStore } from '@/features/chats/api/store';
import { NAVIGATION_LINKS } from '@/features/navigation/constants';
import { Navigation } from '@/shared/constants/navigation';
import { generateImageUrl } from '@/shared/helpers';
import { UserFilled } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChatLineRound } from '@element-plus/icons-vue';
import {useUserStore} from "@/features/users/store/store.ts";
const router = useRouter();
const authStore = useAuthStore()
const chatStore = useChatStore()
const userStore = useUserStore()
 
const avatar = computed(() => authStore.userData.user?.avatar ? generateImageUrl(authStore.userData.user.avatar) : '');

 
const navigation = computed(() => {
    return NAVIGATION_LINKS.filter(link => {
        const role = authStore.role;
        if (!link.roles.length) {
            return true;
        }

        return role && link.roles.includes(role);
    })
});


async function onClick() {
  try {
    await authStore.logout();
    router.push('/auth')
  } catch {

  }
}

</script>
<style lang="scss" scoped>
.avatar {
  border-radius: 50%;
  border: 2px solid var(--gold-dark);
}
.aside {
  grid-area: aside;
  border-right: 1px solid var(--border-gold);
  padding: 2rem;
  display: grid;
  grid-template-rows: max-content 1fr;
  height: inherit;
  gap: 3.2rem;
}

.aside > div {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.badge {
  padding: 10px 14px 10px 0;
}
ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

li {
  list-style: none;
}

a {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(2rem, max-content));
  align-items: center;
  gap: .2rem;
  border-radius: 10px;
  padding: 1rem 20px;

  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;

  transition: background 0.2s, color 0.2s;
}

a:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--gold-primary);
}

.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 500;
}

.logo {
  display: grid;
  row-gap: 3rem;
  padding: 2.4rem 2rem;
  font-size: 15px;
  font-weight: 500;
  color: var(--gold-primary);
  text-transform: uppercase;
}

.info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1rem, max-content));
  align-items: center;
  column-gap: 1rem;
  font-size: 15px;
  font-weight: 500;
}

li {
  & i {
    color: var(--gold-primary);
  }
}
</style>

