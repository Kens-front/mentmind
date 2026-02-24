import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { MENTOR_TYPES } from "../types";
export class CreateMentorProfileDto {
    @IsNumber()
    userId: number

    @IsArray()
    learn_directions: number []

    @IsString()
    @IsOptional()
    level?: MENTOR_TYPES
}
