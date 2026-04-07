import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChatsByUserId } from "../queries/get-chats-by-user-id.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "../entities/chat.entity";
import { In, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { HttpException } from "@nestjs/common";
import { RoleList } from "src/user/types";
import { Message, MESSAGE_STATUSES } from "src/messages/entities/message.entity";

@QueryHandler(GetChatsByUserId)
export class GetChatsByUserIdHandler implements IQueryHandler<GetChatsByUserId> {
  constructor(
    @InjectRepository(Chat) private readonly chat: Repository<Chat>,
  ) {}

  async execute(query: GetChatsByUserId) {
    const user = query.user;

    if (!user) {
      throw new HttpException('Нет доступа', 403)
    }

    if (user.role === RoleList.ADMIN) {
      return this.chat.createQueryBuilder('chat')
        .innerJoin(
          'chat.users',
          'student',
          'student.role = :role',
          { role: RoleList.STUDENT },
        )
        .select([
          'chat.id AS id',
          'student.fullname AS name'
        ])
        .getRawMany()
    }

 

    return this.chat
      .createQueryBuilder('chat')
    
      // текущий пользователь
      .innerJoin(
        'chat.users',
        'me',
        'me.id = :userId',
        { userId: user.id },
      )
    
      // собеседник
      .innerJoin(
        'chat.users',
        'companion',
        'companion.id != :userId',
        { userId: user.id },
      )
    
      // все сообщения (для агрегатов)
      .leftJoin('chat.messages', 'message')
    
      // 👇 meta: для каждого чата берём дату последнего сообщения
      .leftJoin(
        qb =>
          qb
            .subQuery()
            .select('m.chatId', 'chat_id')
            .addSelect('MAX(m.createdAt)', 'last_message_date')
            .from(Message, 'm')
            .groupBy('m.chatId'),
              'last_message_meta',
              'last_message_meta.chat_id = chat.id',
      )
    
      // 👇 подтягиваем само последнее сообщение по (chatId + createdAt)
      .leftJoin(
        Message,
        'last_message',
        `
          last_message.chatId = chat.id
          AND last_message.createdAt = last_message_meta.last_message_date
        `,
      )
    
      .select([
        'chat.id AS id',
    
        'companion.id AS "companionId"',
        'companion.fullname AS "name"',
    
        'COUNT(message.id) AS "messageCount"',
    
        `
        SUM(
          CASE
            WHEN message.status = :status
             AND message.readAt is null
              AND message.sender.id != :userId
            THEN 1
            ELSE 0
          END
        ) AS "countUnread"
        `,
    
        'last_message_meta.last_message_date AS "lastMessageDate"',
        'last_message.text AS "lastMessage"',
      ])
    
      .setParameter('userId', user.id)
      .setParameter('status', MESSAGE_STATUSES.SEND)
      .groupBy('chat.id')
      .addGroupBy('companion.id')
      .addGroupBy('companion.fullname')
      .addGroupBy('last_message_meta.last_message_date')
      .addGroupBy('last_message.text')
    
      .getRawMany();
    
  
  }
}
