import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LessonCreditsService } from './lesson-slot.service';
import { CreateLessonSlotDto } from './dto/create-lesson-slot.dto';
import { UpdateLessonSlotDto } from './dto/update-lesson-slot.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateLessonSlot } from './commands/create-lesson-slot.command';
import { GetLessonSlotsQuery } from './queries/get-lesson-slots.query';
import { UpdateLessonSlotCommand } from './commands/update-lesson-slot.command';

@Controller('lesson-slots')
export class LessonCreditsController {
  constructor(
    private readonly lessonCreditsService: LessonCreditsService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  @Post()
  create(@Body() createLessonSlottDto: CreateLessonSlotDto) {
    return this.commandBus.execute(new CreateLessonSlot(createLessonSlottDto))
  }

  @Get()
  findAll() {
    return this.queryBus.execute(new GetLessonSlotsQuery())
  }

  @Get('/by-filter')
  findOne(@Query('userIds') userIds: string) {
    const array = userIds.split(',')
    return this.queryBus.execute
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonCreditDto: UpdateLessonSlotDto) {
    return this.commandBus.execute(new UpdateLessonSlotCommand(Number(id), updateLessonCreditDto))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonCreditsService.remove(+id);
  }
}
