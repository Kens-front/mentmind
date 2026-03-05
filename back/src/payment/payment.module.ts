import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentHandler } from './handlers/create-payment.handler';
import { GetPaymentsHandler } from './handlers/get-payments.query';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { StudentProfile } from 'src/student_profile/entities/student_profile.entity';
import { LessonSlots } from 'src/lesson-slots/entities/lesson-slot.entity';
import { UpdatePaymentHandler } from './handlers/update-payment.handle';
import { LessonPackage } from 'src/lesson-package/entities/lesson-package.entity';
import {CalculatePaymentQueryHandler} from "./handlers/calculate-payment.handler";
import {User} from "../user/entities/user.entity";
import {YoukassaService} from "../youkassa/youkassa.service";
import { CapturePaymentHandler } from './handlers/capture-payment.handler';


const handlers = [
  CreatePaymentHandler,
  GetPaymentsHandler,
  UpdatePaymentHandler,
  CalculatePaymentQueryHandler,
  CapturePaymentHandler
];

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Lesson, StudentProfile, LessonSlots, LessonPackage, User])],
  controllers: [PaymentController],
  providers: [PaymentService, YoukassaService, ...handlers],
})
export class PaymentModule {}
