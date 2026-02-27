// src/shared/api/http.ts
import axios from 'axios'
import { useAuthStore } from '@/features/auth/store'
import { notifyError } from './notifications'
const isDev = false;
 
export const axiosInstance = axios.create({
  baseURL: 'http://mentmind.ru/api', // твой backend
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `${authStore.token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }

    notifyError(error.response?.data?.message ?? 'Ошибка сервера')
    return Promise.reject(error)
  }
)
