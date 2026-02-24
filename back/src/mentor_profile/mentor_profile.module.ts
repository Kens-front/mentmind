import { Module } from '@nestjs/common';
import { MentorProfileService } from './mentor_profile.service';
import { MentorProfileController } from './mentor_profile.controller';
import { CreateMentorProfileHandler } from './handlers/create-mentor-profile.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorProfile } from './entities/mentor_profile.entity';
import { LearnDirection } from 'src/learn_direction/entities/learn_direction.entity';
import { GetMentorProfileHandler } from './handlers/get-mentor-profile.handler';
import { UpdateMentorProfileHandler } from './handlers/update-mentor-profile.handler';
import { MentorAvailability } from 'src/mentor-availability/entities/mentor-availability.entity';
import { MentorPayout } from 'src/mentor-payout/entities/mentor-payout.entity';
import { GetMentorProfilesHandler } from './handlers/get-mentor-profiles.handler';

const handlers = [
  CreateMentorProfileHandler,
  GetMentorProfileHandler,
  UpdateMentorProfileHandler,
  GetMentorProfilesHandler
];

@Module({
  imports: [TypeOrmModule.forFeature([MentorProfile, LearnDirection, MentorPayout])],
  controllers: [MentorProfileController],
  providers: [MentorProfileService, ...handlers],
})
export class MentorProfileModule {}
