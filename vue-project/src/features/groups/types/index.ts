import type { TUserFull } from "@/features/users/types";

export interface IGroup {
    id: number
    "name": string,
    "description": string,
    "mentorId": number | null,
    studentIds: number[],
}

export interface ICreateGroupDto extends Omit<IGroup, 'id'> {
    
}

export interface IUpdateGroupDto extends Partial<ICreateGroupDto> {

}
