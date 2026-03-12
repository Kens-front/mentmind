import type {TUserFull} from "@/features/users/types";


export interface IPlan {
    id: number
    
    user: TUserFull
    
    items: string
}

export interface ICreatePlanDto {
    items: string;

    userId: number;
}

export interface IUpdatePlanDto extends Partial<ICreatePlanDto> {
    id: number
}