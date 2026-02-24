import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateLearnDirectionDto {
    @IsString({ message: 'Имя должно быть строкой' })
    @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
    @IsNotEmpty({ message: 'Имя должно быть заполнено' })
    title: string
}
