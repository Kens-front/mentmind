import { CreatePaymentDto } from "../dto/create-payment.dto";



export class CreatePaymentCommand {
    constructor(public userId: number, public createPaymentDto: CreatePaymentDto) {}
}