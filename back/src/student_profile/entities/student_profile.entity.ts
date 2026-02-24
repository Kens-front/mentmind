import { Homework } from "src/homework/entities/homework.entity";
import { LearnDirection } from "src/learn_direction/entities/learn_direction.entity";
import { LESSON_TYPES } from "src/lesson/entities/lesson.entity";
 
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { MENTOR_TYPES } from "src/mentor_profile/types";
import { Payment } from "src/payment/entities/payment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, ManyToMany } from "typeorm";


export enum STUDENT_LEVELS {
    JUNIOR = 'junior',
    MIDDLE = 'middle',
    SENIOR = 'senior',
}


@Entity({name: 'student-profile'})
export class StudentProfile {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: STUDENT_LEVELS,
        default: STUDENT_LEVELS.JUNIOR 
    })
    level: STUDENT_LEVELS

    @Column({default: 0})
    amount_lessons: number

    @OneToOne(() => User, (user) => user.student_profile)
    @JoinColumn({ name: 'userId' })
    user: User

    @ManyToOne(() => MentorProfile, (mentor) => mentor.students, { cascade : true})
    @JoinColumn({ name: "mentorId" }) 
    mentor: MentorProfile

    @Column({nullable: true})
    mentorId: number

    @ManyToOne(() => LearnDirection, (direction) => direction.students, {eager: true})
    @JoinColumn()
    learn_direction: LearnDirection
    
    @Column({nullable: true})
    learn_directionId: number

    @Column()
    userId: number

    @OneToMany(() => Homework, (homework) => homework.student)
    homeworks: Homework []

    @Column({default: LESSON_TYPES.BASE, nullable: true})
    lessonFormat: LESSON_TYPES
}
