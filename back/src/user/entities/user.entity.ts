import { BeforeUpdate, Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleList, USER_STATUSES } from "../types";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { Achieve } from "src/achieve/entities/achieve.entity";
import { Chat } from "src/chat/entities/chat.entity";
import { Lesson } from "src/lesson/entities/lesson.entity";
import { Payment } from "src/payment/entities/payment.entity";
 
import { LessonParticipant } from "src/lesson-participant/entities/lesson-participant.entity";
import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";


@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column({
        type: 'enum',
        enum: RoleList,
    })
    role: RoleList

    @Column({ nullable: true }) 
    login: string

    @Column()
    password: string

    @Column({nullable: true})
    about: string

    @Column({nullable: true})
    avatar: string

    @Column({
        type: 'enum',
        enum: USER_STATUSES,
        default: USER_STATUSES.ACTIVE,
    })
    status: USER_STATUSES

    @Column()
    fullname: string

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    @OneToOne(() => StudentProfile, (studentProfile) => studentProfile.user)
    student_profile?: StudentProfile

    @OneToOne(() => MentorProfile, (mentorProfile) => mentorProfile.user)
    mentor_profile?: MentorProfile

    @ManyToMany(() => Achieve, (achieve) => achieve.users)
    achieves: Achieve []

    @ManyToMany(() => Chat, (chat) => chat.users)
    @JoinTable({
        name: 'user_chats', // Уникальное имя для промежуточной таблицы
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'chatId', referencedColumnName: 'id' }
    })
    chats: Chat []

    @OneToMany(() => Payment, payment => payment.user)
    payments: Payment []

    @OneToMany(() => LessonParticipant, lp => lp.lesson)
    lessonParticipations: LessonParticipant []

    @OneToMany(() => LessonPackage, lc => lc.user)
    lessonPackages: LessonPackage []
 
    @BeforeUpdate()
    updateFullname() {
        this.fullname = `${this.first_name} ${this.last_name}`
    }
    
}
