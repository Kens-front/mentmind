import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { USER_STATUSES } from '../types';
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    id?: number;
  
    @IsOptional()
    @ValidateIf(o => o.password !== undefined && o.password !== null && o.password !== '')
    password?: string;

    @IsString()
    @IsOptional()
    status?: USER_STATUSES
}
