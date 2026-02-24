import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chat: Repository<Chat>,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const users = await this.user.find({ where: { id: In(createChatDto.userIds) } });
    const chat = this.chat.create({ users });
    return this.chat.save(chat);
  }

  findAll() {
    return this.chat.find({ relations: ['users', 'messages'] });
  }

  async findOne(id: number) {
    const chat = await this.chat.findOne({ where: { id }, relations: ['users', 'messages'] });
    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }
    return chat;
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    const chat = await this.findOne(id);
    if (updateChatDto.userIds) {
      chat.users = await this.user.find({ where: { id: In(updateChatDto.userIds) } });
    }
    return this.chat.save(chat);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.chat.delete(id);
    return { deleted: true };
  }
}
