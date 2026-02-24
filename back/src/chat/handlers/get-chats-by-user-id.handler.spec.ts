import { GetChatsByUserIdHandler } from './get-chats-by-user-id.handler';
import { GetChatsByUserId } from '../queries/get-chats-by-user-id.query';
import { Chat } from '../entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { In } from 'typeorm';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createQueryBuilderMock = () => {
  const qb: any = {
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };
  return qb;
};

describe('GetChatsByUserIdHandler', () => {
  let handler: GetChatsByUserIdHandler;
  let chatRepo: MockRepo<Chat>;
  let userRepo: MockRepo<User>;
  let qb: any;

  beforeEach(() => {
    qb = createQueryBuilderMock();
    chatRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
      find: jest.fn(),
    };
    userRepo = {};
    handler = new GetChatsByUserIdHandler(chatRepo as any, userRepo as any);
  });

  it('returns empty array when user has no chats', async () => {
    qb.getRawMany.mockResolvedValue([]);
    const result = await handler.execute(new GetChatsByUserId(1));
    expect(result).toEqual([]);
    expect(chatRepo.find).not.toHaveBeenCalled();
  });

  it('maps chats with last message and counters', async () => {
    qb.getRawMany.mockResolvedValue([{ chat_id: 1 }]);
    const messages = [
      { text: 'Hello', isRead: false, createdAt: new Date('2024-01-01') },
      { text: 'World', isRead: true, createdAt: new Date('2024-02-01') },
    ];
    (chatRepo.find as jest.Mock).mockResolvedValue([
      {
        id: 1,
        users: [{ id: 10, first_name: 'John', last_name: 'Doe' }],
        messages,
      },
    ]);

    const result = await handler.execute(new GetChatsByUserId(10));

    expect(chatRepo.find).toHaveBeenCalledWith({
      where: { id: In([1]) },
      relations: ['users', 'messages'],
    });
    expect(result[0].messagesCount).toBe(2);
    expect(result[0].unreadMessages).toBe(1);
    expect(result[0].last_message).toBe('World');
    expect(result[0].users).toEqual([{ id: 10, first_name: 'John', last_name: 'Doe' }]);
  });
});

