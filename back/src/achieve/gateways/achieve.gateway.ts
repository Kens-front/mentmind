import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";





@Injectable()
@WebSocketGateway({cors: {origin: '*'}})
export class AchieveGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private userSocketMap = new Map<string, string>();

    constructor(private readonly commandBus: CommandBus) {}

    handleConnection(client: Socket, ...args: any[]) {
        const userId = client.handshake.query.userId as string;
 
        if (userId) {
            this.userSocketMap.set(userId, client.id);
        }
    }

    handleDisconnect(client: Socket) {
        const userId = Array.from(this.userSocketMap.entries()).find(([_, socketId]) => socketId === client.id)?.[0];

        if (userId) {
            this.userSocketMap.delete(userId)
        }
    }


    async notifyAchieveAwarded(userId: number, achieveTitle: string) {
        const socketId = this.userSocketMap.get(userId.toString())

        if (socketId) {
            this.server.to(socketId).emit('achieveAwarded', {
                title: achieveTitle,
            })
        }
    }

    async createChatMessage(userids: number [], senderId: number, text: string, chatId: number) {
 
        const allParticipantIds = [...new Set(userids)];

        for (const userId of allParticipantIds) {
          const socketId = this.userSocketMap.get(userId.toString());
          if (socketId) {
            this.server.to(socketId).emit('sendMessage', {
              senderId,
              text,
              chatId,
            });
          }
        }
    }
}