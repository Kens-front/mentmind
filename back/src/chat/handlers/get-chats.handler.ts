import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChatQuery } from "../queries/get-chats.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "../entities/chat.entity";
import { Repository } from "typeorm";



@QueryHandler(GetChatQuery)
export class GetChatHandler implements IQueryHandler<GetChatQuery> {
    constructor(@InjectRepository(Chat) private readonly chat: Repository<Chat>) {}

    async execute(query: GetChatQuery): Promise<any> {
        return this.chat.find({relations: ['users']});
    }
}