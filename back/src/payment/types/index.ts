import {User} from "../../user/entities/user.entity";

export enum PAYMENT_STATUS {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum LESSON_DURATION {
    MIN = 60,
    AVERAGE = 90,
    MAX = 120,
}

export interface ICalculatePaymentData  { duration: number, lessonCount: number, user: User}