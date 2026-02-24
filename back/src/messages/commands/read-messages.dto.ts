import { ArrayNotEmpty, IsArray, IsInt } from "class-validator";



export class ReadMessageDto {
    @IsInt()
    chatId: number

    @IsInt()
    lastMessageId: number

    userId: number
}