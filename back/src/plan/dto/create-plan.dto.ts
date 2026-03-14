import {IsArray, IsJSON, IsNumber, IsString} from "class-validator";

export class CreatePlanDto {
    @IsString()
    text: string
    
    @IsNumber()
    userId: number;
}
