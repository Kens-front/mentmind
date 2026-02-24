import { IsNumber, IsString } from "class-validator";

export class CreateHomeworkDto {
    @IsString()
    title: string

    @IsString()
    description: string

    @IsString()
    initialCode: string

    @IsNumber()
    studentId: number
}
