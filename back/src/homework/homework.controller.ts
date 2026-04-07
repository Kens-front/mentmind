import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateHomeWorkCommand } from './commands/create-homework.command';
import { UpdateHomeWorkCommand } from './commands/update-homework.command';
import { GetHomeWorksQuery } from './queries/get-homeworks.query';
import { GetHomeworkQuery } from './queries/get-homework.query';
import { AuthGuard } from 'src/common/decorators/auth-guard';
import {Roles} from "../common/decorators/roles.decorator";

@Controller('homework')
export class HomeworkController {
  constructor(
    private readonly homeworkService: HomeworkService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles('mentor')
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.commandBus.execute(new CreateHomeWorkCommand(createHomeworkDto))
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query('student') student: string,
    @Req() req
  ) {
    return this.queryBus.execute(new GetHomeWorksQuery(req.user, Number(student)));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetHomeworkQuery(+id))
  }

  // @Get('/user/:id')
  // findAllByUserId(@Param('id') id: string) {
  //   return this.queryBus.execute(new GetHomeWorksQuery(+id));
  // }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateHomeworkDto: UpdateHomeworkDto) {
    return this.commandBus.execute(new UpdateHomeWorkCommand(+id, updateHomeworkDto))
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.homeworkService.remove(+id);
  }
}
