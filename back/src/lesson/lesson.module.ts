import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { CreateLessonHandler } from './handlers/create-lesson.handler';
import { UpdateLessonHandler } from './handlers/update-lesson.handler';
import { GetLessonsHandler } from './handlers/get-lessons.handler';
import { MentorAvailability } from 'src/mentor-availability/entities/mentor-availability.entity';
 
import { GetLessonHandler } from './handlers/get-lesson.handler';
 
import { LessonSubscriber } from './subscribers/lesson.subscriber';
import { MentorPayout } from 'src/mentor-payout/entities/mentor-payout.entity';
import { User } from 'src/user/entities/user.entity';
import { LessonSlots } from 'src/lesson-slots/entities/lesson-slot.entity';
import { LessonParticipant } from 'src/lesson-participant/entities/lesson-participant.entity';
import { UserService } from 'src/user/user.service';
import { LessonCreditsService } from 'src/lesson-slots/lesson-slot.service';
import { LessonParticipantService } from 'src/lesson-participant/lesson-participant.service';
import { LessonPackage } from 'src/lesson-package/entities/lesson-package.entity';

const handlers = [
  CreateLessonHandler,
 
  UpdateLessonHandler,
  GetLessonsHandler,
 
  GetLessonHandler,
 
];

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, MentorProfile, StudentProfile, Payment, MentorAvailability, MentorPayout, User, LessonSlots, LessonParticipant, LessonPackage]), CqrsModule],
  controllers: [LessonController],
  providers: [LessonService, LessonSubscriber, ...handlers, UserService, LessonCreditsService, LessonParticipantService],
})
export class LessonModule {}
