import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterUpdate } from 'typeorm';
import { MentorProfile } from 'src/mentor_profile/entities/mentor_profile.entity';
 

@Entity('mentor_availability')
export class MentorAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MentorProfile, (mentorDetails) => mentorDetails.availability_slots)
  mentor_profile: MentorProfile;

  @Column({ type: 'time', nullable: true, precision: 0 })
  start: string;

  @Column({ type: 'time', nullable: true, precision: 0 })
  end: string;

  @Column({ type: 'date', nullable: true })
  date: string;

  @Column()
  mentorProfileId: number;

 
  // @Column({type: 'enum', enum: DayOfWeek})
  // dayOfWeek: DayOfWeek
}