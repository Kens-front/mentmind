import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChatCommand } from './commands/create-chat.command';
import { GetChatQuery } from './queries/get-chats.query';
import { GetChatsByUserId } from './queries/get-chats-by-user-id.query';
import { AuthGuard } from 'src/common/decorators/auth-guard';
import { User } from 'src/user/entities/user.entity';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.commandBus.execute(new CreateChatCommand(createChatDto));
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllByUserId(@Req() request) {
    const user: User | null = request?.user ?? null;
    return this.queryBus.execute(new GetChatsByUserId(user));
  }

  // @Get()
  // findAll() {
  //   return this.queryBus.execute(new GetChatQuery());
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
