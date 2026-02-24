import { CreateMessageHandler } from './create-message.handler';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateMessageCommand } from '../commands/create-message.command';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CreateMessageHandler', () => {
  let handler: CreateMessageHandler;
  let messageRepo: MockRepo<Message>;
  let chatRepo: MockRepo<Chat>;
  let userRepo: MockRepo<User>;
  let gateway: { sendToUser: jest.Mock };

  const dto = { chatId: 1, senderId: 10, text: ' Hello ' };

  beforeEach(() => {
    messageRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };
    chatRepo = {
      findOne: jest.fn(),
    };
    userRepo = {
      findOne: jest.fn(),
    };
    gateway = { sendToUser: jest.fn() };
    handler = new CreateMessageHandler(
      messageRepo as any,
      chatRepo as any,
      userRepo as any,
      gateway as any,
    );
  });

  it('throws when chat not found', async () => {
    (chatRepo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(handler.execute(new CreateMessageCommand(dto as any))).rejects.toThrow('not found chat');
  });

  it('throws when sender not in chat', async () => {
    (chatRepo.findOne as jest.Mock).mockResolvedValue({ id: 1, users: [] });
    (userRepo.findOne as jest.Mock).mockResolvedValue({ id: dto.senderId });
    await expect(handler.execute(new CreateMessageCommand(dto as any))).rejects.toThrow('sender is not part of chat');
  });

  it('creates message and notifies users', async () => {
    const chatUsers = [
      { id: 10, first_name: 'John', last_name: 'Doe' },
      { id: 11, first_name: 'Jane', last_name: 'Roe' },
    ];
    (chatRepo.findOne as jest.Mock).mockResolvedValue({ id: 1, users: chatUsers });
    (userRepo.findOne as jest.Mock).mockResolvedValue(chatUsers[0]);

    const savedMessage = { id: 5, text: dto.text.trim(), chatId: 1 };
    (messageRepo.create as jest.Mock).mockReturnValue(savedMessage);
    (messageRepo.save as jest.Mock).mockResolvedValue(savedMessage);

    const result = await handler.execute(new CreateMessageCommand(dto as any));

    expect(messageRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId: dto.senderId,
        text: dto.text.trim(),
        chatId: 1,
      }),
    );
    expect(gateway.sendToUser).toHaveBeenCalledTimes(chatUsers.length);
    expect(result).toEqual(savedMessage);
  });
});

