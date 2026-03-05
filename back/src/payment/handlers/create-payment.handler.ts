import {CommandHandler, EventBus, ICommandHandler, QueryBus} from "@nestjs/cqrs";
import { CreatePaymentCommand } from "../commands/create-payment.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "../entities/payment.entity";
import { EntityManager, Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { GetUserBy } from "src/user/queries/get-user-by.query";
import { USER_PARAMS } from "src/auth/constants";
import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";
import {CalculatePaymentQuery} from "../queries/calculate-payment.query";
import {YoukassaService} from "../../youkassa/youkassa.service";
import {PaymentPaid} from "../events/payment-paid.event";




@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
    constructor(
        @InjectRepository(Payment) private readonly payment: Repository<Payment>,
        @InjectRepository(LessonPackage) private readonly lessonPackage: Repository<LessonPackage>,
        private youkassaService: YoukassaService,
        private queryBus: QueryBus,
        private eventBus: EventBus,
    ) {}

    async execute(command: CreatePaymentCommand): Promise<any> {
        const {idempotencyKey, totalPrice, youkassaPaymentId} = command
        const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, `${command.userId}`))

        if (!user) {
            throw new HttpException('Нет доступа', 403);
        }

        const payment = this.payment.create({...command.createPaymentDto, idempotencyKey});
        payment.externalPaymentId = youkassaPaymentId;
        payment.user = user;


        this.eventBus.publish(new PaymentPaid(user.id, command.createPaymentDto.lessons_count))
        return {
            payment: await this.payment.save(payment),
        }
    }
}