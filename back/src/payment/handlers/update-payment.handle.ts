import {    CommandHandler, ICommandHandler,   } from "@nestjs/cqrs";
 
import { Payment } from "../entities/payment.entity";
import { EntityManager,     } from "typeorm";
 
import {   PAYMENT_STATUS } from "../types";
import { HttpException } from "@nestjs/common";
 
import { UpdatePaymentCommand } from "../commands/update-payment.command";
import { LessonSlotStatus } from "src/lesson-slots/types";
import { User } from "src/user/entities/user.entity";
import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";



@CommandHandler(UpdatePaymentCommand)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentCommand>
{
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async execute(command: UpdatePaymentCommand): Promise<Payment> {
    const { status, id, lesson_duration } = command.dto;
 

    return this.entityManager.transaction(async manager => {
        // 1. ЛОЧИМ ТОЛЬКО payment
        const payment = await manager.findOne(Payment, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });
      
        if (!payment) {
          throw new HttpException('Платёж не найден', 404);
        }
      
        const wasPaid = payment.status === PAYMENT_STATUS.PAID;
        const willBePaid = command.dto.status === PAYMENT_STATUS.PAID;
      
        payment.status = command.dto.status;
      
        // 3. Создаём кредиты ТОЛЬКО при переходе в PAID
        if (!wasPaid && willBePaid) {
          const lessonPackage = manager.create(LessonPackage, {
            duration: payment.lesson_duration,
            totalCount: payment.lessons_count, 
            userId: payment.userId,
            type: payment.lessonType
          })
      
          lessonPackage.payment = payment
            
            payment.paidAt = new Date();
          await manager.save(LessonPackage, lessonPackage);
        }
      
 
        // 4. Сохраняем payment
        return await manager.save(payment);
      });      
  }
}
