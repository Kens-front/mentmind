import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonSlotDto } from './create-lesson-slot.dto';
import { LessonSlotStatus } from '../types';
import { IsOptional } from 'class-validator';

export enum LESSON_STATUS_CHANGE_REASON {
  COMPLETED_SUCCESSFULLY = 'completed_successfully',
  SCHEDULED_RESCHEDULE = 'scheduled_reschedule',
  DISRESPECTFUL_STUDENT = 'disrespectful_student',
  RESPECTFUL_STUDENT = 'respectful_student',
  DISRESPECTFUL_MENTOR = 'disrespectful_mentor',
  RESPECTFUL_MENTOR = 'respectful_mentor'
}


export class UpdateLessonSlotDto extends PartialType(CreateLessonSlotDto) {
  id: number

  @IsOptional()
  status?: LessonSlotStatus

  @IsOptional()
  reason?: LESSON_STATUS_CHANGE_REASON

}
