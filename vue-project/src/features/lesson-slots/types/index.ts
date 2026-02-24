export interface ILessonSlot {
    id: number
    status: ELessonSlotStatuses
    expiresAt: any
    paymentId: number
    userId: number
    payment: Payment
    duration: number
    reason?: string
}
  
export interface Payment {
    id: number
    userId: number
    amount: number
    lessons_count: number
    lessonType: string
    lesson_duration: number
    provider: string
    status: string
    externalPaymentId: any
    createdAt: string
    paidAt: any
}


export enum ELessonSlotStatuses {
    AVAILABLE = 'available',
    BOOKED = 'booked',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}