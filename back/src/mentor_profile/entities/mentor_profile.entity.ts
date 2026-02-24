import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MENTOR_TYPES } from "../types";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { LearnDirection } from "src/learn_direction/entities/learn_direction.entity";
import { MentorAvailability } from "src/mentor-availability/entities/mentor-availability.entity";
import { MentorPayout } from "src/mentor-payout/entities/mentor-payout.entity";

@Entity({ name: 'mentor-profile' })
export class MentorProfile {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: MENTOR_TYPES,
        default: MENTOR_TYPES.BASE,
    })
    level: MENTOR_TYPES

    @OneToOne(() => User, (user) => user.mentor_profile)
    @JoinColumn({ name: 'userId' })
    user: User

    @OneToMany(() => StudentProfile, (student) => student.mentor, {eager: true})
    students: StudentProfile[]

    @ManyToMany(() => LearnDirection, (direction) => direction.mentors)
    @JoinTable()
    learn_directions: LearnDirection[]

    @OneToMany(() => MentorAvailability, (availability) => availability.mentor_profile, { cascade: true })
    availability_slots: MentorAvailability[]

    @Column()
    userId: number

    @Column({ nullable: true })
    tags: string

    @OneToMany(() => MentorPayout, (payout) => payout.mentor)
    payouts: MentorPayout[]
}
