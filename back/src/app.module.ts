import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';

import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CqrsModule } from '@nestjs/cqrs';

import { LearnDirectionModule } from './learn_direction/learn_direction.module';
import { StudentProfileModule } from './student_profile/student_profile.module';
import { MentorProfileModule } from './mentor_profile/mentor_profile.module';

import { PaymentModule } from './payment/payment.module';
import { LessonModule } from './lesson/lesson.module';
import { MentorAvailabilityModule } from './mentor-availability/mentor-availability.module';
import { MentorPayoutModule } from './mentor-payout/mentor-payout.module';
import { AchieveModule } from './achieve/achieve.module';
import { RequestModule } from './request/request.module';
import { HomeworkModule } from './homework/homework.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { AppGateway } from './app.gateway';
import { GatewyModul } from './websocket/websocket.gateway';
import { AnaliticsModule } from './analitics/analitics.module';
import { LessonSlotsModule } from './lesson-slots/lesson-slot.module';
import { LessonParticipantModule } from './lesson-participant/lesson-participant.module';
import { LessonPackageModule } from './lesson-package/lesson-package.module';
import { MetrikaModule } from './metrika/metrika.module';
import { StudentGroupModule } from './student-group/student-group.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Настроим для глобального использования
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,  // Используем переменные окружения
      port: parseInt(process.env.DB_PORT),  // Преобразуем в число
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }), GatewyModul, UserModule, AuthModule, AdminModule, CqrsModule.forRoot(), MentorPayoutModule, LearnDirectionModule, StudentProfileModule, MentorProfileModule, PaymentModule, LessonModule, MentorAvailabilityModule, AchieveModule, RequestModule, HomeworkModule, ChatModule, MessagesModule, AnaliticsModule, LessonSlotsModule, LessonParticipantModule, LessonPackageModule, MetrikaModule, StudentGroupModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {

}
