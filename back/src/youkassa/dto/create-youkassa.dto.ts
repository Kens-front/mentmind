import {CreatePaymentDto} from "../../payment/dto/create-payment.dto";

export class CreateYoukassaDto {
    idempotencyKey: string;
    
    totalPrice: number;
    
    userId: number;
    
    lesson_count: number;

    email: string
}
