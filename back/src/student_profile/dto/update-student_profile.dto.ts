import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentProfileDto } from './create-student_profile.dto';
import { IsOptional } from 'class-validator';
import { MENTOR_TYPES } from 'src/mentor_profile/types';
import { LESSON_TYPES } from 'src/lesson/entities/lesson.entity';

export class UpdateStudentProfileDto extends PartialType(CreateStudentProfileDto) {
    @IsOptional()
    id?: number

    @IsOptional()
    level?: MENTOR_TYPES

    @IsOptional()
    amount_lessons?: number

    @IsOptional()
    mentorId?: number

    @IsOptional()
    userId?: number

    @IsOptional()
    learn_directions: number []

    @IsOptional()
    lessonFormat?: LESSON_TYPES
}
