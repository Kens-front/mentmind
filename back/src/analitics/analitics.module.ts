import { Module } from '@nestjs/common';
import { AnalyticsService } from './analitics.service';
import { AnalyticsController } from './analitics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
import { MentorPayout } from 'src/mentor-payout/entities/mentor-payout.entity';
import {LessonPackage} from "../lesson-package/entities/lesson-package.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Lesson, MentorProfile, StudentProfile, MentorPayout, LessonPackage])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnaliticsModule {}
