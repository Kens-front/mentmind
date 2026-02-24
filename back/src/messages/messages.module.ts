import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { CreateMessageHandler } from './handlers/create-message.handler';
import { GetMessagesByChatIdHandler } from './handlers/get-messages-by-chat-id.handler';
import { ReadMessagesHandler } from './handlers/read-messages.handler';
import { User } from 'src/user/entities/user.entity';

const handlers = [
  CreateMessageHandler,
  GetMessagesByChatIdHandler,
  ReadMessagesHandler
]
@Module({
  imports: [TypeOrmModule.forFeature([Message, Chat, User]), CqrsModule],
  controllers: [MessagesController],
  providers: [MessagesService,...handlers],
})
export class MessagesModule {}
