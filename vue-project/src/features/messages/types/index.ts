import type { IUser } from "@/features/users/types"

export interface IMessage {
    id: number
    senderId: number
    text: string
    chatId: number
    status: string
    createdAt: Date
    sender: IUser
    readAt: Date
  }
  

  export interface ICreateMessageDto {
    chatId: number
    text: string
  }