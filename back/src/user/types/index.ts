import { CreateUserDto } from "../dto/create-user.dto";

export type Role = 'mentor' | 'student' | 'admin'

export enum RoleList {
    MENTOR = 'mentor',
    STUDENT = 'student',
    ADMIN = 'admin',
}

export enum USER_STATUSES {
    ACTIVE = 'active',
    STOPPED = 'stopped',
}

export interface IUser extends CreateUserDto {
    id: number
}

export interface ITokenData {
    id: number
    last_name: string
    role: Role
    email: string
    avatar: string | null
}