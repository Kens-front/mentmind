import { Command, CommandHandler, EventsHandler, ICommandHandler, IEventHandler } from "@nestjs/cqrs";
import { CreateChatEvent } from "../events/create-chat.event";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "../entities/chat.entity";
import { In, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";



@CommandHandler(CreateChatEvent)
export class CreateChatHandler implements ICommandHandler<CreateChatEvent> {
    constructor(
        @InjectRepository(Chat) private readonly chat: Repository<Chat>,
        @InjectRepository(User) private readonly user: Repository<User>,
    ) {}

    async execute(event: CreateChatEvent): Promise<Chat | {message: string}> {
        const users = await this.user.find({
            where: { id: In(event.userIds) },
        });

        let chat = await this.chat
            .createQueryBuilder('chat')
            .innerJoin('chat.users', 'user')
            .where('user.id IN (:...userIds)', { userIds:event.userIds })
            .groupBy('chat.id')
            .having('COUNT(DISTINCT user.id) = :count', { count: event.userIds.length })
            .getOne();

        if (chat) {
 
            return {message: 'Чат уже существует'}
        }

        chat = this.chat.create()
        chat.users = users;

 
        return this.chat.save(chat);
    }
}
