import { IsOptional, IsString } from "class-validator";

export class CreateAchieveDto {

    @IsString()
    @IsOptional()
    title: string

    @IsString()
    @IsOptional()
    code: string
 
}
