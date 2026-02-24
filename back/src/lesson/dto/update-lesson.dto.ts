import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';
import { IsNumber, IsOptional, Matches } from 'class-validator';
import { LESSON_STATUS } from '../entities/lesson.entity';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {


    @IsOptional()
    status: LESSON_STATUS

    
    @IsOptional()
    lessonLink: string

    
    @IsOptional()
    recordLink: string

    @IsOptional()
    rating: number
    
    @IsOptional()
    notes: string
}
