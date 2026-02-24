import { Module } from '@nestjs/common';
import { LessonParticipantService } from './lesson-participant.service';
import { LessonParticipantController } from './lesson-participant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonParticipant } from './entities/lesson-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonParticipant])],
  controllers: [LessonParticipantController],
  providers: [LessonParticipantService],
})
export class LessonParticipantModule {}
