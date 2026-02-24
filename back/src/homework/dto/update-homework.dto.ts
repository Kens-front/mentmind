import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeworkDto } from './create-homework.dto';
import { IsOptional, IsString } from 'class-validator';
import { EHomeworkStatus } from '../types';

export class UpdateHomeworkDto extends PartialType(CreateHomeworkDto) {
    @IsString()
    @IsOptional()
    status: EHomeworkStatus

    @IsString()
    initialCode: string;
}
