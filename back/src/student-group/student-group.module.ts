import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentGroup } from './entities/student-group.entity';
import { StudentGroupController } from './student-group.controller';
import { CreateStudentGroupHandler } from './handlers/create-student-group.handler';
import { GetStudentGroupHandler } from './handlers/get-student-group.handler';
import { GetStudentGroupsHandler } from './handlers/get-student-groups.handler';
import { GetStudentGroupsByMentorHandler } from './handlers/get-student-groups-by-mentor.handler';
import { User } from 'src/user/entities/user.entity';
import { LessonPackage } from 'src/lesson-package/entities/lesson-package.entity';

const CommandHandlers = [CreateStudentGroupHandler];
const QueryHandlers = [GetStudentGroupHandler, GetStudentGroupsByMentorHandler, GetStudentGroupsHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentGroup, User, LessonPackage]),
    CqrsModule,
  ],
  controllers: [StudentGroupController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class StudentGroupModule { }
