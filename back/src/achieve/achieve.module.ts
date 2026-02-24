import { Module } from '@nestjs/common';
import { AchieveService } from './achieve.service';
import { AchieveController } from './achieve.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achieve } from './entities/achieve.entity';
import { CreateAchieveHandler } from './handlers/create-achieve.handler';
import { UpdateAchieveHandler } from './handlers/update-achieve.handler';
import { FirstLessonCompletedByMentor } from './handlers/items/first-lesson-completed-by-mentor.handler';
import { User } from 'src/user/entities/user.entity';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
import { GetAchievesHandler } from './handlers/get-achieve.handler';
import {LessonParticipant} from "../lesson-participant/entities/lesson-participant.entity";


const handlers = [
  CreateAchieveHandler,
  UpdateAchieveHandler,
  FirstLessonCompletedByMentor,
  GetAchievesHandler
]
@Module({
  imports: [TypeOrmModule.forFeature([Achieve, User, MentorProfile, StudentProfile, LessonParticipant])],
  controllers: [AchieveController],
  providers: [AchieveService, ...handlers],
})
export class AchieveModule {}
