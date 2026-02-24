import { Lesson, LESSON_TYPES } from "src/lesson/entities/lesson.entity";
import { Payment } from "src/payment/entities/payment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LessonSlotStatus } from "../types";
import { LessonParticipant } from "src/lesson-participant/entities/lesson-participant.entity";
import { LESSON_DURATION } from "src/payment/types";

// lesson-credit.entity.ts
@Entity('lesson_slots')
export class LessonSlots {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({type: 'varchar', length: 5, nullable: true})
  start_time: string

  @Column({ type: 'varchar', length: 5, nullable: true })
  end_time: string

  @Column({type: 'varchar', length: 10, nullable: true})
  date: string

  @Column({
    type: 'enum',
    enum: LessonSlotStatus,
    default: LessonSlotStatus.AVAILABLE,
  })
  status: LessonSlotStatus;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({default: LESSON_DURATION.MIN})
  duration: number;

  @Column()
  lessonType: LESSON_TYPES;

  // Если тебе реально нужен линк credit -> lessons, оставь как есть.
  // Но имей в виду: одна lesson сейчас может иметь только один lessonCredit.
  @ManyToOne(() => Lesson, (lesson) => lesson.lessonSlots)
  @JoinColumn({name: 'lessonId'})
  lesson: Lesson;
}
