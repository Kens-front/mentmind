import { StudentProfile } from "src/student_profile/entities/student_profile.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EHomeworkStatus } from "../types";

@Entity('homework')
export class Homework {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    initialCode: string

    @Column({enum: EHomeworkStatus, default: EHomeworkStatus.PENDING, type: 'enum'})
    status: EHomeworkStatus

    @ManyToOne(() => StudentProfile, (student) => student.homeworks, {eager: true})
    student: StudentProfile 

    @Column({nullable: true})
    studentId: number

    @CreateDateColumn({type: 'timestamptz'})
    createAt: Date

    @UpdateDateColumn({type: 'timestamptz'})
    updateAt: Date
}
