import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreatePaymentCommand } from "../commands/create-payment.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "../entities/payment.entity";
import { EntityManager, Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { GetUserBy } from "src/user/queries/get-user-by.query";
import { USER_PARAMS } from "src/auth/constants";
import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";




@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
    constructor(
        @InjectRepository(Payment) private readonly payment: Repository<Payment>,
        @InjectRepository(LessonPackage) private readonly lessonPackage: Repository<LessonPackage>,
 
        private queryBus: QueryBus,
    ) {}

    async execute(command: CreatePaymentCommand): Promise<any> {
        const user = await this.queryBus.execute(new GetUserBy(USER_PARAMS.ID, `${command.userId}`))

        if (!user) {
            throw new HttpException('Нет доступа', 403);
        }

        const payment = this.payment.create(command.createPaymentDto);

        payment.user = user;


        return this.payment.save(payment)
    }
}