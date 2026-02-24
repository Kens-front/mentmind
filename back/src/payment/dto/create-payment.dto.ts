import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { LESSON_DURATION, PAYMENT_STATUS } from "../types";
import { LESSON_TYPES } from "src/lesson/entities/lesson.entity";

export class CreatePaymentDto {

    @IsNumber()
    lessons_count: number

    @IsNumber()
    lesson_duration: LESSON_DURATION

    @IsString()
    @IsOptional()
    status?: PAYMENT_STATUS

    @IsString()
    lessonType: LESSON_TYPES

    @IsInt()
    amount: number
}
