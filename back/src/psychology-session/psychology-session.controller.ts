import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { PsychologySessionService } from './psychology-session.service';
import { CreatePsychologySessionDto } from './dto/create-psychology-session.dto';
import { UpdatePsychologySessionDto } from './dto/update-psychology-session.dto';
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {GetPsychologySessionsQuery} from "./queries/get-psychology-sessions.query";
import {AuthGuard} from "../common/decorators/auth-guard";
import {CurrentUser} from "../common/decorators/current-user";
import {User} from "../user/entities/user.entity";
import {CreatePsychologySessionCommand} from "./create-psychology-session.command";
import {Roles} from "../common/decorators/roles.decorator";
import {UpdatePsychologySessionCommand} from "./command/update-psychology-session.command";

@Controller('psychology-session')
export class PsychologySessionController {
  constructor(
      private readonly psychologySessionService: PsychologySessionService,
      private commandBus: CommandBus,
      private queryBus: QueryBus
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles('admin')
  create(@Body() createPsychologySessionDto: CreatePsychologySessionDto) {
    return this.commandBus.execute(new CreatePsychologySessionCommand(createPsychologySessionDto));
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
      @CurrentUser() user: User
  ) {
    return this.queryBus.execute(new GetPsychologySessionsQuery(user));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psychologySessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsychologySessionDto: UpdatePsychologySessionDto) {
    return this.commandBus.execute(new UpdatePsychologySessionCommand({...updatePsychologySessionDto, id: Number(id)}));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psychologySessionService.remove(+id);
  }
}
