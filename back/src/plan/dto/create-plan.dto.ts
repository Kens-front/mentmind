import {IsArray, IsJSON, IsNumber, IsString} from "class-validator";

export class CreatePlanDto {
    @IsJSON()
    items: { title: string; description: string }[]
    
    @IsNumber()
    userId: number;
}
