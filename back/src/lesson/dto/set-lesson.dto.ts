import { IsNumber, IsOptional, IsString, IsArray, IsEnum, Matches } from "class-validator";
import { LESSON_TYPES } from "../entities/lesson.entity";
import { LESSON_DURATION } from "src/payment/types";

export class SetLessonDto {
    @IsOptional()
    @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    start_time?: string

    @IsArray()
    studentIds: number []

    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date: string

    @IsNumber()
    mentorId: number

    @IsEnum(LESSON_DURATION)
    duration: LESSON_DURATION

    @IsOptional()
    @IsNumber()
    id: number

    @IsEnum(LESSON_TYPES)
    @IsOptional()
    lesson_type: LESSON_TYPES

    @IsString()
    @IsOptional()
    notes: string
}
