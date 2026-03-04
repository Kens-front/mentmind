import type {TUserFull} from "@/features/users/types";

export interface ICreatePsychologySessionDto {
    date: string
    
    time: string
}

export interface IPsychologySession {
    id: number;
    
    date: string;

    time: string;
    
    user: TUserFull;

    status: 'open' | 'close';
}