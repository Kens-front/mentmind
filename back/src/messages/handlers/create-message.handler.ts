import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateMessageCommand } from "../commands/create-message.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Message, MESSAGE_STATUSES } from "../entities/message.entity";
import { Repository } from "typeorm";
import { Chat } from "src/chat/entities/chat.entity";
import { BadRequestException, ForbiddenException, HttpException, NotFoundException } from "@nestjs/common";
import { AppGateway } from "src/app.gateway";
import { User } from "src/user/entities/user.entity";


@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler implements ICommandHandler<CreateMessageCommand> {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly gateway: AppGateway,
  ) {}

  async execute(command: CreateMessageCommand): Promise<Message> {
    const { chatId, text, senderId } = command.createMessageDto;

    const trimmedText = text?.trim();
    if (!trimmedText) {
      throw new BadRequestException('Message text is empty');
    }

    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ['users'], // messages НЕ грузим
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const sender = chat.users.find((user) => user.id === senderId);
    if (!sender) {
      throw new ForbiddenException('Sender is not a member of this chat');
    }

    const message = this.messageRepo.create({
      chatId: chat.id,
      senderId: sender.id,
      sender,
      text: trimmedText,
      status: MESSAGE_STATUSES.SEND
    });

    const savedMessage = await this.messageRepo.save(message);

    // WebSocket — не должен ломать бизнес-логику
    try {
      for (const user of chat.users) {
        this.gateway.sendToUser(
          String(user.id),
          'message',
          savedMessage,
        );
      }
    } catch (err) {
      // логируем, но не падаем
    }

    return savedMessage;
  }
}