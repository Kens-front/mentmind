import { ElMessage } from 'element-plus'

type MessageType = 'success' | 'error' | 'warning' | 'info'

export function notify(
  type: MessageType,
  message: string
) {
  ElMessage({
    type,
    message,
    duration: 3000,
    showClose: true,
  })
}

export const notifySuccess = (message: string) =>
    notify('success', message)
  
  export const notifyError = (message: string) =>
    notify('error', message)