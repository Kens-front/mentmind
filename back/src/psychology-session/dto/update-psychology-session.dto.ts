import { PartialType } from '@nestjs/mapped-types';
import { CreatePsychologySessionDto } from './create-psychology-session.dto';
import {IsNumber, IsOptional, IsString} from "class-validator";

export class UpdatePsychologySessionDto extends PartialType(CreatePsychologySessionDto) {
    @IsNumber()
    @IsOptional()
    id: number;
    
    @IsString()
    @IsOptional()
    status: 'open' | 'close'
}
