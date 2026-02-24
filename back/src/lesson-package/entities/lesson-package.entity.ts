import { LessonParticipant } from "src/lesson-participant/entities/lesson-participant.entity";
import { LESSON_TYPES } from "src/lesson/entities/lesson.entity";
import { Payment } from "src/payment/entities/payment.entity";
import { LESSON_DURATION } from "src/payment/types";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, ManyToOne, JoinColumn } from "typeorm";

@Entity({name: 'lesson-package'})
export class LessonPackage {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    type: LESSON_TYPES

    @Column()
    duration: LESSON_DURATION

    @Column()
    totalCount: number

    @Column({default: 0})
    usedCount: number

    @Column({ default: 'active' })
    status: 'active' | 'exhausted'

    @OneToOne(() => Payment, payment => payment.lessonPackage)
    payment: Payment

    @OneToOne(() => LessonParticipant, lp => lp.lessonPackage)
    participants: LessonParticipant []

    @ManyToOne(() => User, user => user.lessonPackages)
    @JoinColumn({name: 'userId'})
    user: User

    @Column()
    userId: number

    @CreateDateColumn() 
    createAt: Date
}
