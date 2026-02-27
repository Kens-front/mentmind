import type { LESSON_TYPES } from "@/features/lessons/types"
import type { TProfile } from "../api"
import type { IMentorProfile, IStudentProfile } from "../store/store"

export enum RoleList {
    MENTOR = 'mentor',
    STUDENT = 'student',
    ADMIN = 'admin',
}

export enum USER_STATUSES {
    ACTIVE = 'active',
    STOPPED = 'stopped',
}

export enum USER_LEVEL {
    BASE = 'base',
    PREMIUM = 'premium',
    SENIOR = 'senior',
    JUNIOR = 'junior',
    MIDDLE = 'middle',
}


export interface IUser {
    id: number


    first_name: string


    last_name: string

    email: string


    phone: string

    role: RoleList

    login: string


    password: string


    status: USER_STATUSES


    fullname: string


    deletedAt: Date;

    chats?: any[]

    mentor_profile?: IMentorProfile

    student_profile?: IStudentProfile

    availableLessonCreditsCount?: number

    about: string

    avatar: string
}


export type TUserFull = IUser & TProfile


export interface IUserColumn {
    props: string
    label: string
    width?: number | undefined
}


export interface IUserFull {
    user: IUser
    profile: TProfile
}

export type TUserFullSpread = IUser & TProfile

export interface IUpdateUserFull {
    user: Partial<IUserForm>
    profile: Partial<TProfile>
}


export interface IUserForm {
    first_name: string,
    last_name: string,
    email: string,
    login: string,
    phone: string,
    password: string,
    role: RoleList
}

export interface IUserUpdateForm {
    first_name: string,
    last_name: string,
    email: string,
    login: string,
    phone: string,
    status: string,
    role: string
    about: string
    level: USER_LEVEL
 
    lessonFormat: LESSON_TYPES
    learn_direction: number,
    learn_directions: number[],
    mentorId: number,
    tags: string[]
}