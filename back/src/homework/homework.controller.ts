import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateHomeWorkCommand } from './commands/create-homework.command';
import { UpdateHomeWorkCommand } from './commands/update-homework.command';
import { GetHomeWorksQuery } from './queries/get-homeworks.query';
import { GetHomeworkQuery } from './queries/get-homework.query';
import { AuthGuard } from 'src/common/decorators/auth-guard';

@Controller('homework')
export class HomeworkController {
  constructor(
    private readonly homeworkService: HomeworkService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.commandBus.execute(new CreateHomeWorkCommand(createHomeworkDto))
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req) {
    return this.queryBus.execute(new GetHomeWorksQuery(req.user));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetHomeworkQuery(+id))
  }

  // @Get('/user/:id')
  // findAllByUserId(@Param('id') id: string) {
  //   return this.queryBus.execute(new GetHomeWorksQuery(+id));
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkDto: UpdateHomeworkDto) {
    return this.commandBus.execute(new UpdateHomeWorkCommand(+id, updateHomeworkDto))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkService.remove(+id);
  }
}
