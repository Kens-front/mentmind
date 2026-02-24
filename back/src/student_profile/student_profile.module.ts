import { Module } from '@nestjs/common';
import { StudentProfileService } from './student_profile.service';
import { StudentProfileController } from './student_profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfile } from './entities/student_profile.entity';
import { CreateStudentProfileHandler } from './handlers/create-student-profile.handler';
import { LearnDirection } from 'src/learn_direction/entities/learn_direction.entity';
import { GetStudentProfileHandler } from './handlers/get-student-profile.handler';
import { UpdateStudentProfileHandler } from './handlers/update-student-profile.handler';


const handlers = [
  CreateStudentProfileHandler,
  GetStudentProfileHandler,
  UpdateStudentProfileHandler,
];


@Module({
  imports: [TypeOrmModule.forFeature([StudentProfile, LearnDirection])],
  controllers: [StudentProfileController],
  providers: [StudentProfileService, ...handlers],
})
export class StudentProfileModule {}
