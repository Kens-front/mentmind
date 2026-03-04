import {IsNumber, IsString} from "class-validator";

export class CreatePsychologySessionDto {
    @IsNumber()
    userId: number

    @IsString()
    date: string

    @IsString()
    time: string
}