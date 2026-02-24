import { IsOptional, IsEnum, IsNumber, IsString } from "class-validator";
import { RoleList } from "../types";
import { USER_STATUSES } from "../types";

export class GetUsersQueryParamsDto {
    @IsOptional()
    @IsNumber()
    userId?: number;
  
    @IsOptional()
    @IsEnum(RoleList)
    role?: RoleList;
  
    @IsOptional()
    @IsEnum(USER_STATUSES)
    status?: USER_STATUSES;
  
    @IsOptional()
    @IsNumber()
    mentorId?: number;

    @IsOptional()
    @IsString()
    onlyGroup?: string;


    @IsOptional()
    @IsString()
    lessonFormat?: string;

  }
  