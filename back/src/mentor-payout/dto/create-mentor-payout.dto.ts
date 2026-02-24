import { IsNumber, IsOptional } from "class-validator";
import { Lesson } from "src/lesson/entities/lesson.entity";

export class CreateMentorPayoutDto {
    @IsNumber()
    userId: number

    @IsNumber()
    lessonId: number

    @IsOptional()
    fineAmount?: number

    @IsOptional()
    amount?: number

    @IsOptional()
    finalAmount?: number
}
