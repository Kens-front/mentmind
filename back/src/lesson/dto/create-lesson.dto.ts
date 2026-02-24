import { IsNumber, IsOptional, IsString, IsArray, IsEnum, Matches } from "class-validator";
import { LESSON_DURATION } from "src/payment/types";
import { LESSON_TYPES } from "../entities/lesson.entity";

export class CreateLessonDto {
    @IsOptional()
    @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    start_time?: string

    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    date?: string

    @IsOptional()
    @IsEnum(LESSON_TYPES)
    lessonType?: LESSON_TYPES

    @IsNumber()
    @IsOptional()
    duration: LESSON_DURATION

    @IsNumber()
    @IsOptional()
    price: number

    @IsOptional()
    @IsNumber()
    finePercent?: number

    @IsOptional()
    notes?: string

    @IsArray()
    studentIds: number[]

    @IsNumber()
    mentorId: number

    @IsOptional()
    lessonLink?: string

    @IsOptional()
    kind?: LESSON_TYPES

    @IsOptional()
    isGroupLesson?: boolean

    @IsOptional()
    @IsNumber()
    studentGroupId?: number
}
