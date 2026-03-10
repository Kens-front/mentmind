import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";

@Entity('plan')
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'json', nullable: true, default: []})
    items: { title: string; description: string }[]
    
    @OneToOne(type => User, (user) => user.plan)
    @JoinColumn({name: 'userId'})
    user: User;
}
