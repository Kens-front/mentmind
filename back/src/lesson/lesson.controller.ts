import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateLessonCommand } from './commands/update-lesson.command';
import { GetLessonsQuery } from './queries/get-lessons.query';
import { SetLessonDto } from './dto/set-lesson.dto';
import { SetLessonCommand } from './commands/set-lesson.command';
import { GetLessonQuery } from './queries/get-lesson.query';
import { GetAvailableLessonsQuery } from './queries/get-available-lessons.query';
import { CreateLessonCommand } from './commands/create-lesson.command';
import { CreateTrialLessonCommand } from './commands/create-trial-lesson.command';
import { LESSON_STATUS } from './entities/lesson.entity';
import { AuthGuard } from 'src/common/decorators/auth-guard';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private queryBus: QueryBus,
    private commandBus: CommandBus
  ) {}

  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Req() req,
    @Query('status') status: LESSON_STATUS,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
  ) {
    return this.queryBus.execute(new GetLessonsQuery({userId: +req.user?.id, status, start_date, end_date}));
  }

  @Get('available-lesson/:userId')
  findAvailables(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetAvailableLessonsQuery(+userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetLessonQuery(+id));
  }


  @Patch('/planned')
  createPlanned(@Body() updateLessonDto: CreateLessonDto) {
    return this.commandBus.execute(new CreateLessonCommand({...updateLessonDto}))
  }

  @Patch('/trial')
  createTrial(@Body() updateLessonDto: CreateLessonDto) {
    return this.commandBus.execute(new CreateTrialLessonCommand({...updateLessonDto}))
  }

  @Patch('/set')
  setLesson(@Param('id') id: string, @Body() setLessonDto: SetLessonDto) {
    return this.commandBus.execute(new SetLessonCommand(setLessonDto))
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.commandBus.execute(new UpdateLessonCommand(+id, updateLessonDto))
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}
