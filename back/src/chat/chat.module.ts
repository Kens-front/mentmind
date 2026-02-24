import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatHandler } from './handlers/create-chat.handler';
import { User } from 'src/user/entities/user.entity';
import { GetChatHandler } from './handlers/get-chats.handler';
import { GetChatsByUserIdHandler } from './handlers/get-chats-by-user-id.handler';


const handlers = [
  CreateChatHandler,
  GetChatHandler,
  GetChatsByUserIdHandler
]

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User]), CqrsModule],
  controllers: [ChatController],
  providers: [ChatService, ...handlers],
})
export class ChatModule {}
