import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GetUsersHandler } from './handlers/get-users.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GetUserByHandler } from './handlers/get-user-by.handler';
import { UpdateUserHandler } from './handlers/update-user.handler';
import { LearnDirection } from 'src/learn_direction/entities/learn_direction.entity';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
import { GetStudentProfilesByMentorIdHandler } from '../user/handlers/get-student-profiles-by-mentro-id.handler';
import { GetUserFullHandler } from './handlers/get-user-full.handler';
import { UpdateUserFullHandler } from './handlers/update-user-full.handler';
import { UpdateAvatarHandler } from './handlers/update-avatar.handler';
import {LessonPackage} from "../lesson-package/entities/lesson-package.entity";

const handlers = [
  GetUsersHandler,
  GetUserByHandler,
  GetUserFullHandler,
  UpdateUserFullHandler,
  UpdateUserHandler,
  GetStudentProfilesByMentorIdHandler,
  UpdateAvatarHandler
]
@Module({
  imports: [TypeOrmModule.forFeature([User, MentorProfile, StudentProfile, LearnDirection, LessonPackage])],
  controllers: [UserController],
  providers: [UserService, ...handlers],
})
export class UserModule { }
