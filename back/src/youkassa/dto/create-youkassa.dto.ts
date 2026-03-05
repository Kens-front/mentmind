import {CreatePaymentDto} from "../../payment/dto/create-payment.dto";

export class CreateYoukassaDto {
    idempotencyKey: string;
    
    totalPrice: number;

    createPaymentDto: CreatePaymentDto;
}
