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



// Типы событий
export type YookassaEventType =
    | 'payment.succeeded'
    | 'payment.waiting_for_capture'
    | 'payment.canceled'
    | 'refund.succeeded'
    | 'payout.succeeded';

// Базовая структура объекта платежа
export interface YookassaPaymentObject {
    id: string;
    status: string;
    amount: {
        value: string;
        currency: string;
    };
    description?: string;
    recipient?: {
        account_id: string;
        gateway_id: string;
    };
    created_at: string;
    captured_at?: string;
    expires_at?: string;
    metadata?: Record<string, string>;
    payment_method?: {
        type: string;
        id?: string;
        saved?: boolean;
        card?: {
            first6: string;
            last4: string;
            expiry_month: string;
            expiry_year: string;
            card_type: string;
        };
    };
    chargeback?: {
        status: string;
    };
    refunded_amount?: {
        value: string;
        currency: string;
    };
    paid: boolean;
    refundable: boolean;
    test: boolean;
}

// Структура всего вебхука
export interface YookassaWebhookPayload {
    type: 'notification';
    event: YookassaEventType;
    object: YookassaPaymentObject;
}