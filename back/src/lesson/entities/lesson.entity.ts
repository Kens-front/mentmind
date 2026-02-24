import { LessonSlots } from "src/lesson-slots/entities/lesson-slot.entity";
import { LessonParticipant } from "src/lesson-participant/entities/lesson-participant.entity";
import { MentorPayout } from "src/mentor-payout/entities/mentor-payout.entity";
import { LESSON_DURATION } from "src/payment/types";
import { StudentGroup } from "src/student-group/entities/student-group.entity";

import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
export enum LESSON_STATUS {
  AVAILABLE = 'available',
  PLANNED = 'planned',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum LESSON_PAYOUTS {
  PAID = 'paid',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum LESSON_TYPES {
  MULTIPLE = 'multiple',
  BASE = 'base',
  PREMIUM = 'premium',
  TRIAL = 'trial',
  FREE = 'free',
  GROUP = 'group'
}

export const MENTOR_PAYOUTS = {
  base: 3200,
  premium: 1800
};

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 5, nullable: true })
  start_time: string

  @Column({ type: 'varchar', length: 5, nullable: true })
  end_time: string

  @Column({ type: 'varchar', length: 10, nullable: true })
  date: string

  @Column({
    type: 'enum',
    enum: LESSON_DURATION,
    default: LESSON_DURATION.MIN,
  })
  duration: LESSON_DURATION;

  @Column({
    type: 'enum',
    enum: LESSON_STATUS,
    default: LESSON_STATUS.AVAILABLE,
  })
  status: LESSON_STATUS;

  @Column({
    type: 'enum',
    enum: LESSON_TYPES,
    default: LESSON_TYPES.BASE,
  })
  lessonType: LESSON_TYPES;

  /** Цена занятия в копейках */
  @Column({ type: 'int', default: 5 })
  price: number;


  @Column({ type: 'int', default: 0 })
  finePercent: number;

  @Column({ type: 'text', nullable: true })
  lessonLink: string | null;

  @Column({ type: 'text', nullable: true })
  recordLink: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToOne(() => MentorPayout, (payout) => payout.lesson)
  @JoinColumn({ name: 'payoutId' })
  payout: MentorPayout;

  @OneToMany(() => LessonSlots, slot => slot.lesson)
  lessonSlots?: LessonSlots[];

  @Column({ type: 'int', nullable: true, default: 5 })
  rating: number | null;

  @OneToMany(
    () => LessonParticipant,
    (participant) => participant.lesson,
    { cascade: false },
  )
  participants: LessonParticipant[];

  // Для групповых занятий - связь с группой студентов
  @ManyToOne(() => StudentGroup, { nullable: true })
  @JoinColumn({ name: 'studentGroupId' })
  studentGroup: StudentGroup;

  @Column({ nullable: true })
  studentGroupId: number;

  // Флаг группового занятия
  @Column({ default: false })
  isGroupLesson: boolean;

}
