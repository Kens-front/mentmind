import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MentorProfileService } from './mentor_profile.service';
import { CreateMentorProfileDto } from './dto/create-mentor_profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor_profile.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMentorProfileQuery } from './queries/get-mentor-profile.query';
import { UpdateMentorCommand } from './commands/update-mentor.command';
import { GetMentorProfilesQuery } from './queries/get-mentor-profiles.query';

@Controller('mentor-profile')
export class MentorProfileController {
  constructor(
    private readonly mentorProfileService: MentorProfileService,
    private commandBus:CommandBus,
    private queryBus: QueryBus
  ) {}

  @Post()
  create(@Body() createMentorProfileDto: CreateMentorProfileDto) {
    return this.mentorProfileService.create(createMentorProfileDto);
  }

  @Get()
  findAll() {
    return this.queryBus.execute(new GetMentorProfilesQuery())
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetMentorProfileQuery(+id))
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMentorProfileDto: UpdateMentorProfileDto) {
    return this.commandBus.execute(new UpdateMentorCommand(+id, updateMentorProfileDto))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorProfileService.remove(+id);
  }
}
