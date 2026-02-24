
import { MentorProfile } from "src/mentor_profile/entities/mentor_profile.entity";
import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'learn-direction'})
export class LearnDirection {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @OneToMany(() => StudentProfile, (student) => student.learn_direction)
    students: StudentProfile[]
    
    @ManyToMany(() => MentorProfile, (mentor) => mentor.learn_directions) 
    mentors: MentorProfile []
}
