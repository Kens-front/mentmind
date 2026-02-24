import { IsOptional, IsString } from "class-validator"

export class CreateMetrikaDto {
    @IsString()
    @IsOptional()
    id?: string

    sessionId?: string

    @IsString()
    event: string
}
