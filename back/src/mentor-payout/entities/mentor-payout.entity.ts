import { Lesson, LESSON_PAYOUTS } from "src/lesson/entities/lesson.entity";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'mentor-payout'})
export class MentorPayout {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => MentorProfile, (mentor) => mentor.payouts)
    @JoinColumn({name: 'mentorId'})
    mentor: MentorProfile

    @OneToOne(() => Lesson, (lesson) => lesson.payout)
    lesson: Lesson

    @Column({ default: 0, type: "float" })
    fineAmount: number;

    @Column({type: "float", nullable: true})
    amount: number

    @Column({type: "float",  nullable: true})
    finalAmount: number;

    @Column()
    mentorId: number

    @Column()
    lessonId: number

    @Column({
        type: 'enum',
        enum: LESSON_PAYOUTS,
        default: LESSON_PAYOUTS.PENDING,
      })
    status: LESSON_PAYOUTS;

    @Column({type: 'date', nullable: true })
    paidAt?: Date;

    @CreateDateColumn({type: 'date'}) 
    createAt: Date
}
