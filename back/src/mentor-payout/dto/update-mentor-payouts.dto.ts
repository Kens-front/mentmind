import { IsNumber, IsOptional, IsString } from "class-validator";
import { LESSON_PAYOUTS } from "src/lesson/entities/lesson.entity";



export class UpdateMentorPayoutsDto {
    @IsString()
    start_date: string   

    @IsString()
    end_date: string   

    @IsNumber()
    mentorId: number   

    @IsString()
    @IsOptional()
    status: LESSON_PAYOUTS  

}