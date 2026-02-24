import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'metrika'})
export class Metrika {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({default: 0})
    pageView: number

    @Column({default: 0})
    formView: number

    @Column()
    event: string
}
