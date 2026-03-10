import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestDto } from './create-request.dto';
import {IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
    
    @IsNumber()
    id: number;
    
    @IsString()
    @IsOptional()
    status: 'open' | 'closed'
}
