import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'request'})
export class Request {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    method: string
    
    @Column()
    callbackMethod: string

    @Column()
    text: string
    
    @Column({default: 'open'})
    status: 'open' | 'closed'

    @CreateDateColumn({type: 'date'})
    createAt: Date
}
