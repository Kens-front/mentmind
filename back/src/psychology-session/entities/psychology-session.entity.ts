import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";


@Entity('psychology-session')
export class PsychologySession {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    date: string;
    
    @Column()
    time: string;
    
    @Column({nullable: true})
    link: string;
    
    @ManyToOne(() => User, (user) => user.psychologySessions)
    @JoinColumn({name: 'userId'})
    user: User;
    
    @Column({default: 'open'})
    status: 'open' | 'close';
}
