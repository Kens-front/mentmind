import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMessageCommand } from './commands/create-message.command';
import { GetMessagesByChatIdQuery } from './queries/get-messages-by-chat-id.query';
import { ReadMessageDto } from './commands/read-messages.dto';
import { ReadMessagesCommand } from './commands/read-messages.command';
import { AuthGuard } from 'src/common/decorators/auth-guard';
 

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createMessageDto: CreateMessageDto) {
    const id = req.user?.id ?? 0;
    return this.commandBus.execute(new CreateMessageCommand({...createMessageDto, senderId: id}));
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get('/chat/:id')
  findAllByChatId(@Param('id') id: string) {
    return this.queryBus.execute(new GetMessagesByChatIdQuery(+id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch('/read')
  @UseGuards(AuthGuard)
  read(@Req() req, @Body() updateMessageDto: ReadMessageDto) {
    return this.commandBus.execute(new ReadMessagesCommand(updateMessageDto.chatId, updateMessageDto.lastMessageId, Number(req.user.id) ))
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
