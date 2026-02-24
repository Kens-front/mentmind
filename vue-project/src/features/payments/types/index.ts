import type { ILessonPackage } from "@/features/lesson-package/api";
import type { LESSON_TYPES } from "@/features/lessons/types";
import type { TUserFull } from "@/features/users/types";

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


export interface IStudentPayout {
  id: number;
 
   
  user: TUserFull


  userId: number


  amount: number;


  lessons_count: number;


  lessonType: LESSON_TYPES;


  lesson_duration: LESSON_DURATION


  provider: string; // yookassa, stripe, qr, manual


  status: PAYMENT_STATUS;


  externalPaymentId: string; // id от платёжки


  createdAt: Date;


  paidAt: Date;

  lessonPackage: ILessonPackage
}

export interface IStudentPayoutDto {
    lessons_count: number

    lesson_duration: LESSON_DURATION

    status?: PAYMENT_STATUS

    lessonType: LESSON_TYPES

    amount: number
}