import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";


@Entity('psychology-pack')
export class PsychologyPack {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({default: 1})
    available_count: number;
    
    @Column({default: 0})
    used_count: number;
    
    @Column({default: 'active'})
    status: 'active' | 'inactive';
    
    @ManyToOne(type => User, user => user.psychologyPacks)
    @JoinColumn({ name: 'userId' })
    user: User;
}
