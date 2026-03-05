import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CapturePaymentCommand} from "../commands/capture-payment.command";
import {InjectRepository} from "@nestjs/typeorm";
import {Payment} from "../entities/payment.entity";
import {Repository} from "typeorm";
import {YoukassaService} from "../../youkassa/youkassa.service";
import {NotFoundException} from "@nestjs/common";


@CommandHandler(CapturePaymentCommand)
export class CapturePaymentHandler implements ICommandHandler<CapturePaymentCommand> {
    constructor(
        @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
        private yookassaService: YoukassaService
    ) {}
    
    async execute(command: CapturePaymentCommand): Promise<any> {
        const payment = await this.paymentRepository.findOne({
            where: {
                externalPaymentId: command.payment.object?.id
            }
        })
        
        if (!payment) {
            throw new NotFoundException("Payment does not exist");
        }
        
        return this.yookassaService.capturePayment(command.payment, payment.idempotencyKey)
    }
}