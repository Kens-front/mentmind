import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { MentorAvailabilityService } from './mentor-availability.service';
import { CreateMentorAvailabilityDto } from './dto/create-mentor-availability.dto';
import { UpdateMentorAvailabilityDto } from './dto/update-mentor-availability.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMentorAvailabilityCommand } from './commands/create-mentor-availablity.command';
import { GetMentorAvailabiltiessQuery } from './queries/get-mentor-availabilty.query';
import { GetMentorAvailabiltiesByUserIdQuery } from './queries/get-mentor-ability-by-user-id.query';
import { AuthGuard } from 'src/common/decorators/auth-guard';

@Controller('mentor-availability')
export class MentorAvailabilityController {
  constructor(
    private readonly mentorAvailabilityService: MentorAvailabilityService,
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createMentorAvailabilityDto: { slots: CreateMentorAvailabilityDto [], period: {start: string, end: string}}, @Req() req) {
    return this.commandBus.execute(new CreateMentorAvailabilityCommand({...createMentorAvailabilityDto, userId: +req.user.id}))
  }

  
  @Get('/me')
  @UseGuards(AuthGuard)
  findOne(@Req() req, @Query() query) {
    return this.queryBus.execute(new GetMentorAvailabiltiessQuery(+req.user.id, query));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOneByMentorId(@Param('id') id: string, @Query() query: {date: string}) {
    return this.queryBus.execute(new GetMentorAvailabiltiesByUserIdQuery(+id, query));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMentorAvailabilityDto: UpdateMentorAvailabilityDto) {
    return this.mentorAvailabilityService.update(+id, updateMentorAvailabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorAvailabilityService.remove(+id);
  }
}
