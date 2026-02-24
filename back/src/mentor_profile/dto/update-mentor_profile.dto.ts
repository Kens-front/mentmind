import { PartialType } from '@nestjs/mapped-types';
import { CreateMentorProfileDto } from './create-mentor_profile.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { MENTOR_TYPES } from '../types';

export class UpdateMentorProfileDto extends PartialType(CreateMentorProfileDto) {
    @IsNumber()
    @IsOptional()
    id: number

    @IsEnum(MENTOR_TYPES)
    @IsOptional()
    level?: MENTOR_TYPES
}
