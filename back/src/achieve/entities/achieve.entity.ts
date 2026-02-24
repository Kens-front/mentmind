import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'achieves'})
export class Achieve {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    title: string

    @Column({nullable: true})
    code: string

    @Column({nullable: true})
    file: string

    @ManyToMany(() => User, (user) => user.achieves)
    @JoinTable({
        name: 'achieve-users', // Уникальное имя для промежуточной таблицы
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'achieveId', referencedColumnName: 'id' },
    })
    users: User[]
}
