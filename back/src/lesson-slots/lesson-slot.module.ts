import { Module } from '@nestjs/common';
import { LessonCreditsService } from './lesson-slot.service';
import { LessonCreditsController } from './lesson-slot.controller';
import { CreateLessonCreditHandler } from './handlers/create-lesson-slot.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonSlots } from './entities/lesson-slot.entity';
import { GetLessonCreditsHandler } from './handlers/get-lesson-slots.handler';
import { GetLessonCreditHandler } from './handlers/get-lesson-slot.handler';
import { LessonParticipant } from 'src/lesson-participant/entities/lesson-participant.entity';
import { UpdateLessonSlotHandler } from './handlers/update-lesson-slot.handler';
import { LessonPackage } from 'src/lesson-package/entities/lesson-package.entity';


const handlers = [
  CreateLessonCreditHandler,
  GetLessonCreditsHandler,
  GetLessonCreditHandler,
  UpdateLessonSlotHandler
]
@Module({
  imports: [TypeOrmModule.forFeature([LessonSlots, LessonParticipant, LessonPackage])],
  controllers: [LessonCreditsController],
  providers: [LessonCreditsService, ...handlers],
})
export class LessonSlotsModule {}
