import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMessagesByChatIdQuery } from "../queries/get-messages-by-chat-id.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../entities/message.entity";
import { Repository } from "typeorm";


@QueryHandler(GetMessagesByChatIdQuery)
export class GetMessagesByChatIdHandler implements IQueryHandler<GetMessagesByChatIdQuery> {
    constructor(@InjectRepository(Message) private readonly message: Repository<Message>) {}

    async execute(query: GetMessagesByChatIdQuery): Promise<any> {
 
        const message = this.message.createQueryBuilder('message')
            .leftJoin('message.sender', 'sender')
            .select([
                'message.id',
                'message.text',
                'message.createdAt',
                'message.status',
                'message.readAt',
                'sender.fullname',
                'sender.id',
            ])
            .where('message.chatId = :chatId', { chatId: query.chatId })
            .orderBy('message.createdAt', 'ASC')
            .getMany();
        return message
    }
}