import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import type { ILogin, ILoginResponse } from '../types';
import { authApi } from '../api';
 

export const useAuthStore = defineStore('auth', () => {

  const loginData = reactive<ILogin>({
    login: '',
    password: '',
  });

  const userData = reactive<ILoginResponse>({
    user: null,
    token: '',
  })

  /**
   * @description Флаг авторизации
   */
  const isAuthenticated = ref(false);
  const isInitialized = ref(false);

  const token = ref('');
  
  const role = computed(() => userData.user?.role);

  async function login(loginData: ILogin) {
    const {data} = await authApi.login(loginData);
    isAuthenticated.value = true;
    userData.user = data.user
    userData.token = data.token
    localStorage.setItem('token', data.token)
  } 

  async function logout() {
    await authApi.logout();
    userData.user = null
    userData.token = '';
    isAuthenticated.value = false;
    localStorage.removeItem('token')
  }
 
  async function validate() {
    const token = localStorage.getItem('token');
    if (!token) {
      isAuthenticated.value = false;
      return false;
    }

    try {
      const {data} = await authApi.validate();

      userData.user = data

      isAuthenticated.value = true

      return true
    } catch {
      logout()
      isAuthenticated.value = false;

      return false;
    }
  }

  return {
    token,
    isAuthenticated,
    loginData,
    isInitialized,
    userData,
    role,
    logout,
    login,
    validate
  };
});
