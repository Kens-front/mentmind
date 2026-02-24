import {IsNotEmpty, IsOptional} from "class-validator"

export class CreateRequestDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    method: string
    
    @IsNotEmpty()
    callbackMethod: string
    
    @IsOptional()
    text: string
}
