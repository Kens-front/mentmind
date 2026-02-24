import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from './entities/homework.entity';
import { CreateHomeworkHandler } from './handlers/create-homework.handler';
import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
import { UpdateHomeworkHandler } from './handlers/update-homework.handler';
import { GetHomeWorksHandler } from './handlers/get-homeworks.handler';
import { User } from 'src/user/entities/user.entity';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
import { GetHomeworkHandler } from './handlers/get-homework.handler';


const handlers = [
  CreateHomeworkHandler,
  UpdateHomeworkHandler,
  GetHomeWorksHandler,
  GetHomeworkHandler
];

@Module({
  imports: [TypeOrmModule.forFeature([Homework, StudentProfile, User, MentorProfile])],
  controllers: [HomeworkController],
  providers: [HomeworkService, ...handlers],
})
export class HomeworkModule {}
