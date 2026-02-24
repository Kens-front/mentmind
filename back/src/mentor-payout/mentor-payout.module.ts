import { Module } from '@nestjs/common';
import { MentorPayoutService } from './mentor-payout.service';
import { MentorPayoutController } from './mentor-payout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorPayout } from './entities/mentor-payout.entity';
import { CreateMentorPayoutHandler } from './handlers/create-mentor-payout.handler';
import { GetMentorPayoutsHandler } from './handlers/get-mentor-payouts.handler';
import { UpdateMentorPayoutHandler } from './handlers/update-mentor-payout.handler';
import { UpdateMentorPayoutsHandler } from './handlers/update-mentor-payouts.handler';

const handlers = [
  CreateMentorPayoutHandler,
  GetMentorPayoutsHandler,
  UpdateMentorPayoutHandler,
  UpdateMentorPayoutsHandler
]
@Module({
  imports: [TypeOrmModule.forFeature([MentorPayout])],
  controllers: [MentorPayoutController],
  providers: [...handlers, MentorPayoutService],
})
export class MentorPayoutModule {}
