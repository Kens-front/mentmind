import { CreateMessageDto } from "../dto/create-message.dto";




export class CreateMessageCommand {
    constructor(public createMessageDto: CreateMessageDto) {}
}