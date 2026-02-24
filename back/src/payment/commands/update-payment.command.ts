import { UpdatePaymentDto } from "../dto/update-payment.dto";



export class UpdatePaymentCommand {
    constructor(public dto: UpdatePaymentDto) {}
}