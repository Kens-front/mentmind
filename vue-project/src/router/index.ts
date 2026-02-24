import { useAuthStore } from '@/features/auth/store';
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // 1. Восстанавливаем сессию при первом заходе
  if (!authStore.isInitialized) {
    authStore.isInitialized = true;
    await authStore.validate(); // проверка токена / сессии
  }

  const requiresAuth = to.matched.some(
    (record) => record.meta.requiresAuth
  );

  // 2. Неавторизованный → на /auth
  if (requiresAuth && !authStore.isAuthenticated) {
    return { path: '/auth' };
  }

  // 3. Авторизованный → не пускаем на /auth
  if (to.path === '/auth' && authStore.isAuthenticated) {
    return { path: '/' };
  }

  // 4. Всё ок
  return true;
});

export default router
