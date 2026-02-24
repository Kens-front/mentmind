import { IsNumber } from "class-validator";

export class CreateStudentProfileDto {
    @IsNumber()
    userId: number

    @IsNumber()
    learn_direction: number
}
