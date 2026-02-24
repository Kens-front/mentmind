import { CreateChatDto } from "../dto/create-chat.dto";


export class CreateChatCommand {
    constructor(public createChatDto: CreateChatDto) {}
}