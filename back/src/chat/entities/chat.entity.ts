import { Message } from "src/messages/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'chat'})
export class Chat {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => User, (user) => user.chats)
    users: User []

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message []

}
