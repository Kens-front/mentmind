import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { MentorPayoutService } from './mentor-payout.service';
import { CreateMentorPayoutDto } from './dto/create-mentor-payout.dto';
import { UpdateMentorPayoutDto } from './dto/update-mentor-payout.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMentorPayoutCommand } from './commands/create-mentor-payout.command';
import { GetMentorPayoutsQuery } from './queries/get-mentor-payouts.query';
import { AuthGuard } from 'src/common/decorators/auth-guard';
import { UpdateMentorPayoutCommand } from './commands/update-mentor-payout.command';
import { UpdateMentorPayoutsDto } from './dto/update-mentor-payouts.dto';
import { UpdateMentorPayoutsCommand } from './commands/update-mentor-payouts.command';

@Controller('mentor-payout')
export class MentorPayoutController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly mentorPayoutService: MentorPayoutService
  ) {}

  @Post()
  create(@Body() createMentorPayoutDto: CreateMentorPayoutDto) {
    return this.commandBus.execute(new CreateMentorPayoutCommand(createMentorPayoutDto));
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Req() req,
    @Query() query
  ) {
    return this.queryBus.execute(new GetMentorPayoutsQuery(req.user, query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorPayoutService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMentorPayoutDto: UpdateMentorPayoutDto) {
    return this.commandBus.execute(new UpdateMentorPayoutCommand({id: Number(id), ...updateMentorPayoutDto}))
  }

  @Patch()
  updateSome(@Body() updateMentorPayoutDto: UpdateMentorPayoutsDto) {
    return this.commandBus.execute(new UpdateMentorPayoutsCommand({ ...updateMentorPayoutDto, mentorId: Number(updateMentorPayoutDto.mentorId)}))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorPayoutService.remove(+id);
  }
}
