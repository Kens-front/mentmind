import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
