 import { LESSON_TYPES } from "src/lesson/entities/lesson.entity";
import { Column, CreateDateColumn, Entity,  JoinColumn,  ManyToOne,  OneToMany,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { LESSON_DURATION, PAYMENT_STATUS } from "../types";
import { User } from "src/user/entities/user.entity";
import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";
 

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;
 
  @ManyToOne(() => User, user => user.payments)
  @JoinColumn({name:'userId'})          
  user: User

  @Column()
  userId: number

  @Column()
  amount: number;

  @Column()
  lessons_count: number;

  @Column()
  lessonType: LESSON_TYPES;

  @Column({enum: LESSON_DURATION, type: 'enum', default: LESSON_DURATION.MIN})
  lesson_duration: LESSON_DURATION

  @Column({default: 'yookassa'})
  provider: string; // yookassa, stripe, qr, manual

  @Column({type: 'enum', default: PAYMENT_STATUS.PENDING, enum: PAYMENT_STATUS})
  status: PAYMENT_STATUS;

  @Column({ nullable: true })
  externalPaymentId: string; // id от платёжки

  @CreateDateColumn({type: 'date'})
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;
 
  @OneToOne(() => LessonPackage, lp => lp.payment)
  @JoinColumn({name: 'lessonPackageId'})
  lessonPackage: LessonPackage
}