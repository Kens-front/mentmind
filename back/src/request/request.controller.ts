import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetRequestQuery } from './queries/get-requests.query';
import { CreateRequestCommand } from './commands/create-request.command';
import {UpdateRequestCommand} from "./commands/update-request.command";

@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.commandBus.execute(new CreateRequestCommand(createRequestDto));
  }

  @Get()
  findAll(@Query() query: any) {
    return this.queryBus.execute(new GetRequestQuery(query))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.commandBus.execute(new UpdateRequestCommand({...updateRequestDto, id: Number(id)}));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}
