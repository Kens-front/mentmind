import { CreatePaymentDto } from "../dto/create-payment.dto";



export class CreatePaymentCommand {
    constructor(
        public userId: number, 
        public createPaymentDto: CreatePaymentDto, 
        public totalPrice: number, 
        public idempotencyKey: string,
        public youkassaPaymentId: string
    ) {}
}