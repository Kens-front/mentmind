import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonParticipantService } from './lesson-participant.service';
import { CreateLessonParticipantDto } from './dto/create-lesson-participant.dto';
import { UpdateLessonParticipantDto } from './dto/update-lesson-participant.dto';

@Controller('lesson-participant')
export class LessonParticipantController {
  constructor(private readonly lessonParticipantService: LessonParticipantService) {}

  @Post()
  create(@Body() createLessonParticipantDto: CreateLessonParticipantDto) {
    return this.lessonParticipantService.create(createLessonParticipantDto);
  }

  @Get()
  findAll() {
    return this.lessonParticipantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonParticipantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonParticipantDto: UpdateLessonParticipantDto) {
    return this.lessonParticipantService.update(+id, updateLessonParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonParticipantService.remove(+id);
  }
}
