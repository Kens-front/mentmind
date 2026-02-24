import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { CreateStudentGroupCommand } from './commands/create-student-group.command';
import { GetStudentGroupQuery } from './queries/get-student-group.query';
import { GetStudentGroups } from './queries/get-student-groups.query';
import { GetStudentGroupsByMentorQuery } from './queries/get-student-groups-by-mentor.query';
import { AuthGuard } from 'src/common/decorators/auth-guard';

@Controller('student-groups')
export class StudentGroupController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  async createGroup(@Body() dto: CreateStudentGroupDto) {
    return await this.commandBus.execute(new CreateStudentGroupCommand(dto));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getGroup(@Param('id') id: string) {
    return await this.queryBus.execute(new GetStudentGroupQuery(+id));
  }

  @Get()
  @UseGuards(AuthGuard)
  async getGroups(@Req() req) {
    const role = req.user.role;
    const userId = req.user.id
    return await this.queryBus.execute(new GetStudentGroups(role, Number(userId)));
  }

  @Get('mentor/:mentorId')
  @UseGuards(AuthGuard)
  async getGroupsByMentor(@Param('mentorId') mentorId: string) {
    return await this.queryBus.execute(new GetStudentGroupsByMentorQuery(+mentorId));
  }
}
