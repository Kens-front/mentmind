import type { ILessonSlot } from "@/features/lesson-slots/types"
import type { IMentorProfile, IStudentProfile } from "@/features/users/store/store"
import type { IUser } from "@/features/users/types"

export enum LESSON_STATUS {
    AVAILABLE = 'available',
    PLANNED = 'planned',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum LESSON_PAYOUTS {
    PAID = 'paid',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
}

export enum LESSON_TYPES {
    GROUP = 'group',
    BASE = 'base',
    PREMIUM = 'premium',
    TRIAL = 'trial',
    FREE = 'free'
}

export enum LESSON_DURATION {
    MIN = 60,
    AVERAGE = 90,
    MAX = 120,
  }

export interface ICreateLessonDto {

    start_time: string

    status?: LESSON_STATUS

    date: string

    rating?: number

    lessonType?: LESSON_TYPES
    recordLink: string

    duration: LESSON_DURATION

    price: number


    finePercent?: number


    notes?: string

    studentIds: number []

    mentorId: number

    lesson_link?: string 
 
    kind?: string 

    studentFullname?: {name: string, id: number}

    mentorFullname?: {name: string, id: number}

    lessonLink?: string

    reason?: number
}

export interface ILesson {
    id: number

    start_time: string

    end_time: string


    date: string


    duration: LESSON_DURATION;


    status: LESSON_STATUS;


    lessonType: LESSON_TYPES;


    lessonPayoutStatus: LESSON_PAYOUTS;

    /** Цена занятия в копейках */

    price: number;

    /** Выплата ментору в копейках */

    mentorPayoutAmount: number;


    finePercent: number;


    lessonLink: string | null;


    recordLink: string | null;

    notes: string | null;


    students: IStudentProfile[];

    mentor: IMentorProfile;

    users: IUser []

    participants: any []

    rating: number | null;

    lessonSlots: ILessonSlot []
}


export interface IUpdateLessonDto extends Partial<ILesson> {
 
}