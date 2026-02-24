import { Chat } from "src/chat/entities/chat.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


export enum MESSAGE_STATUSES {
    SEND = 'sent',
    UNSENT = 'unsent'
}
@Entity({name: 'message'})
@Index(['chatId', 'createdAt'])
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    senderId: number
    
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderId' })
    sender: User

    @Column()
    text: string

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat

    @Column()
    chatId: number

    @Column({enum: MESSAGE_STATUSES, type: 'enum', default: MESSAGE_STATUSES.UNSENT})
    status: MESSAGE_STATUSES

    @CreateDateColumn({nullable: true, type: "timestamptz"})
    createdAt: Date; 

    @Column({nullable: true, type: "timestamptz"})
    readAt: Date | null
}
