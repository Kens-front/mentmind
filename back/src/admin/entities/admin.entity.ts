import { User } from "src/user/entities/user.entity";
import { ChildEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number
}
