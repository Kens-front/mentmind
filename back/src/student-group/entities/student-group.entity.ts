import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('student_groups')
export class StudentGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Ментор, который создал группу (владелец группы)
  @ManyToOne(() => User, { nullable: false })
  mentor: User;

  @Column()
  mentorId: number;

  // Студенты в группе
  @ManyToMany(() => User, { cascade: false })
  @JoinTable({
    name: 'student_group_members',
    joinColumn: { name: 'groupId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
  })
  students: User[];

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'int', default: 10 })
  maxStudents: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
