import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReadMessagesCommand } from "../commands/read-messages.command";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Message, MESSAGE_STATUSES } from "../entities/message.entity";
import { HttpException } from "@nestjs/common";
import { AppGateway } from "src/app.gateway";
import { Chat } from "src/chat/entities/chat.entity";



@CommandHandler(ReadMessagesCommand)
export class ReadMessagesHandler implements ICommandHandler<ReadMessagesCommand> {
    constructor(
        @InjectRepository(Message) private readonly message: Repository<Message>,
        @InjectRepository(Chat) private readonly chat: Repository<Chat>,
        private readonly gateway: AppGateway,
    ) {}


    async execute(command: ReadMessagesCommand): Promise<any> {
        const {chatId, lastMessageId, userId } = command
        const readAt = new Date().toISOString();

        // const updatedMessages = await this.message.createQueryBuilder('message')
        // .update(Message)
        // .set({
        //   readAt
        // })
        // .where('chatId = :chatId', { chatId: command.chatId})
        // .andWhere('id <= :lastMessageId', { lastMessageId: command.lastMessageId })
        // .andWhere('senderId != :userId', { userId: command.userId })
        // .andWhere('readAt IS NULL')
        // .execute()

        // ⚠️ WebSocket — отдельно от бизнес-логики
        try {

            const chat = await this.chat.findOne({
                where: { id: chatId },
                relations: ['users'],
            });

            if (!chat) return;


             const payload = {
                chatId,
                userId,
                lastMessageId,
                readAt,
            };

            for (const user of chat.users) {
                this.gateway.sendToUser(
                    String(user.id),
                    'messages_read',
                    payload,
                );
            }
        } catch (err) {
            console.error('WebSocket read notification failed', err);
        }

        // return this.message.createQueryBuilder('message')
        //     .innerJoin('message.chat', 'chat')
        //     .where('chat.id = :chatId', { chatId: command.chatId})
        //     .andWhere('message.id <= :lastMessageId', { lastMessageId: command.lastMessageId })
        //     .andWhere('message.senderId != :userId', { userId: command.userId })
        //     .andWhere('message.readAt IS NULL')
        //     .getCount()
    }
}