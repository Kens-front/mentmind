import { ReadMessagesHandler } from './read-messages.handler';
import { Repository, In } from 'typeorm';
import { Message } from '../entities/message.entity';
import { ReadMessagesCommand } from '../commands/read-messages.command';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReadMessagesHandler', () => {
  let handler: ReadMessagesHandler;
  let messageRepo: MockRepo<Message>;

  beforeEach(() => {
    messageRepo = {
      update: jest.fn(),
    };
    handler = new ReadMessagesHandler(messageRepo as any);
  });

  it('marks messages as read', async () => {
    (messageRepo.update as jest.Mock).mockResolvedValue({ affected: 2 });

    const ids = [1, 2];
    const result = await handler.execute(new ReadMessagesCommand(ids));

    expect(messageRepo.update).toHaveBeenCalledWith({ id: In(ids) }, { isRead: true });
    expect(result).toEqual({ affected: 2 });
  });
});

