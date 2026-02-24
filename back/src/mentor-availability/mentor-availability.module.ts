import { Module } from '@nestjs/common';
import { MentorAvailabilityService } from './mentor-availability.service';
import { MentorAvailabilityController } from './mentor-availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorAvailability } from './entities/mentor-availability.entity';
import { CreateAvailabilitySlotsHandler } from './handlers/create-mentor-availability.handler';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
import { GetMentorAvailabiltiesdHandler } from './handlers/get-mentor-availabilty.handler';
import { GetMentorAvailabiltiesByUserIdHandler } from './handlers/get-mentor-ability-by-user-id.handler';

const handlers = [
  CreateAvailabilitySlotsHandler,
  GetMentorAvailabiltiesdHandler,
  GetMentorAvailabiltiesByUserIdHandler
]
@Module({
  imports: [TypeOrmModule.forFeature([MentorAvailability, MentorProfile])],
  controllers: [MentorAvailabilityController],
  providers: [MentorAvailabilityService, ...handlers],
})
export class MentorAvailabilityModule {}
