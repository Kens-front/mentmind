import type { IStudentProfile } from "@/features/users/store/store"
import type { IUser, TUserFull } from "@/features/users/types"

export enum EHomeworkStatus {
    PENDING = 'pending',
    CHECKING = 'checking',
    COMPLETED = 'completed',
}



export interface ICreateHomeworkDto {
    studentId: number
    title: string
    description: string
    initialCode: string
}

export interface IHomework {
    id: number
    studentId: number
    title: string
    description: string
    initialCode: string
    status: EHomeworkStatus
    student: IStudentProfile 
    createAt: Date
    updateAt: Date
}