// src/gateway/main.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtPort } from './jwt/jwt.service';

@WebSocketGateway({
  cors: { origin: '*'},
  transports: ['websocket'],
})
@Injectable()
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private jwtPort: JwtPort){}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  async handleConnection(client: Socket) {
    const id = client.handshake.auth?.id;

    if (!id) {
      client.disconnect(true);
      return;
    }

 
    client.data.userId = id;
    client.join(`user:${id}`);
    console.log(`user:${id}`)
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    console.log('disconect', client.data.userId)
  }

  /** Отправка пользователю (во все его вкладки) */
  sendToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  addAchieve(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  /** Broadcast в любую комнату */
  broadcastToRoom(room: string, event: string, payload: any) {
    this.server.to(room).emit(event, payload);
  }
}