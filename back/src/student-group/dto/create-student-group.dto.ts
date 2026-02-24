import { IsArray, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateStudentGroupDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  mentorId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  studentIds: number[];

  @IsOptional()
  @IsNumber()
  @Min(2)
  maxStudents?: number;
}
