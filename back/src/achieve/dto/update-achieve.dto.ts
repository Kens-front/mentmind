import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EAchieves } from '../types';

export class UpdateAchieveDto {
    @IsNumber()
    @IsOptional()
    userId: number

    @IsNumber()
    @IsOptional()
    leesonId?: number

    @IsEnum(EAchieves)
    @IsOptional()
    code: EAchieves
}
