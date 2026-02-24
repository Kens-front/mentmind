// src/user/dto/any-user.dto.ts
import { IsString, MinLength, IsEmail, Matches, IsEnum, IsOptional, IsNumber, IsArray, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { USER_STATUSES } from 'src/user/types';


 
export class AnyUserDto {
 
}