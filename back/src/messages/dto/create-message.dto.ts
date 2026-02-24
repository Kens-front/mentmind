import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateMessageDto {

    @IsNumber()
    chatId: number

    senderId: number

    @IsString()
    @IsNotEmpty()
    text: string
}
