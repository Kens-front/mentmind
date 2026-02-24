import { IsString, MinLength, IsEmail, IsOptional, Matches, IsNumber, ValidateIf, IsArray, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { RoleList } from "../types";
export class CreateUserDto {
    @IsString({ message: 'Имя должно быть строкой' })
    @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    first_name: string;
  
    @IsString({ message: 'Фамилия должна быть строкой' })
    @MinLength(2, { message: 'Фамилия должна содержать минимум 2 символа' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    last_name: string;
  
    @IsEmail({}, { message: 'Некорректный формат email' })
    @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
    email: string;
  
    @IsString({ message: 'Телефон должен быть строкой' })
    @Matches(/^\+7\(\d{3}\)\d{3}-\d{4}$/, {
      message: 'Некорректный формат номера телефона (например, +1234567890)',
    })
    @IsOptional()
    phone: string;
  
    @IsString({ message: 'Логин должен быть строкой' })
    @MinLength(4, { message: 'Логин должен содержать минимум 4 символа' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    login: string;
  
    @IsEnum(RoleList, { message: 'Роль должна быть одной из: mentor, student, admin' })
    role: RoleList;
  
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Пароль должен содержать хотя бы одну заглавную букву, строчную букву и цифру',
    })
    password: string;
 
    @IsOptional()
    deletedAt?: Date;

    @IsArray()
    @IsOptional()
    learn_directions: number [];

    @IsNumber()
    @IsOptional()
    learn_direction: number;
}
