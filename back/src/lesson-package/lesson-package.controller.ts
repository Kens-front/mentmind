import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LessonPackageService } from './lesson-package.service';
import { CreateLessonPackageDto } from './dto/create-lesson-package.dto';
import { UpdateLessonPackageDto } from './dto/update-lesson-package.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetLessonPackageQuery } from './queries/get-lesson-package.query';
import { AddBonusLessonCommand } from './commands/add-bonus.lesson.command';

@Controller('lesson-package')
export class LessonPackageController {
  constructor(
    private readonly lessonPackageService: LessonPackageService,
    private queryBus: QueryBus,
    private commandBus: CommandBus
  ) { }

  @Post()
  create(@Body() createLessonPackageDto: CreateLessonPackageDto) {
    return this.lessonPackageService.create(createLessonPackageDto);
  }


  @Get()
  findOne(@Query() query: any) {
    const array = query.userIds || []
    return this.queryBus.execute(new GetLessonPackageQuery(array.map(item => Number(item))));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonPackageDto: UpdateLessonPackageDto) {
    return this.lessonPackageService.update(+id, updateLessonPackageDto);
  }

  @Patch('/bonus/:id')
  addBonus(@Param('id') id: string) {
    return this.commandBus.execute(new AddBonusLessonCommand(Number(id)))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonPackageService.remove(+id);
  }
}
