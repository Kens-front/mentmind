import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
 
import { UpdateStudentProfileDto } from './dto/update-student_profile.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetStudentProfileQuery } from './queries/get-student-profile.query';
import { UpdateStudentProfileCommand } from './commands/update-student-profile.command';
 
@Controller('student-profile')
export class StudentProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private commandBus: CommandBus
  ) {}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetStudentProfileQuery(+id))
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentProfileDto: UpdateStudentProfileDto) {
    return this.commandBus.execute(new UpdateStudentProfileCommand(+id, updateStudentProfileDto))
  }

}
