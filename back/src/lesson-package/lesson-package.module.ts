import { Module } from '@nestjs/common';
import { LessonPackageService } from './lesson-package.service';
import { LessonPackageController } from './lesson-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonPackage } from './entities/lesson-package.entity';
import { GetLessonPackageHandler } from './handlers/get-lesson-package.handler';
import { AddBonusLessonHandler } from './handlers/add-bonus-lesson.handler';
import { User } from 'src/user/entities/user.entity';


const handlers = [
  GetLessonPackageHandler,
  AddBonusLessonHandler
]
@Module({
  imports: [TypeOrmModule.forFeature([LessonPackage, User])],
  controllers: [LessonPackageController],
  providers: [LessonPackageService, ...handlers],
})
export class LessonPackageModule {}
