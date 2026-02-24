import { IsNumber, IsISO8601, IsString } from "class-validator";
 
export class CreateMentorAvailabilityDto {
    @IsString( )
    start: string;

    @IsString( )
    end: string;

    @IsString( )
    date: string;
    
 
    // @IsEnum(DayOfWeek)
    // dayOfWeek: DayOfWeek
}
