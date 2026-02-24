import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";
import { LessonSlots } from "src/lesson-slots/entities/lesson-slot.entity";
import { Lesson } from "src/lesson/entities/lesson.entity";
import { User } from "src/user/entities/user.entity";
import { RoleList } from "src/user/types";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('lesson_participants')
export class LessonParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.participants, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column({nullable: true})
  lessonId: number;

  @ManyToOne(() => User, (user) => user.lessonParticipations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: RoleList,
  })
  role: RoleList;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => LessonPackage, lp => lp.participants)
  @JoinColumn({name: 'lessonPackageId'})
  lessonPackage: LessonPackage
}
