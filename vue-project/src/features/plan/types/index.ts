import type {TUserFull} from "@/features/users/types";


export interface IPlan {
    id: number
    
    user: TUserFull
    
    text: string
}

export interface ICreatePlanDto {
    text: string;

    userId: number;
}

export interface IUpdatePlanDto extends Partial<ICreatePlanDto> {
    id: number
}