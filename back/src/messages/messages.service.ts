import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly message: Repository<Message>,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    const message = this.message.create(createMessageDto);
    return this.message.save(message);
  }

  findAll() {
    return this.message.find();
  }

  async findOne(id: number) {
    const message = await this.message.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);
    Object.assign(message, updateMessageDto);
    return this.message.save(message);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.message.delete(id);
    return { deleted: true };
  }
}
