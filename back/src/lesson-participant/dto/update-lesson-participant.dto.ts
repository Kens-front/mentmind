import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonParticipantDto } from './create-lesson-participant.dto';

export class UpdateLessonParticipantDto extends PartialType(CreateLessonParticipantDto) {}
