import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto, ScanItemDto, ScanUserDto } from './events.dto';

export type RoomData = {
  room: string;
  params: any;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  io: Server;

  roomsMap = new Map<string, RoomData>();

  afterInit(server: Server) {
    this.logger.log('Initialized');
    this.io = server;
  }
  handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);

    const { query } = client.handshake;
    const { room } = query;

    if (typeof room == 'string') {
      this.logger.log(`Client id: ${client.id} joined room: ${room}`);
      client.join(room);
    }
  }

  handleDisconnect(client: Socket) {
    client.rooms.forEach((room) => {
      const roomData = this.io.sockets.adapter.rooms.get(room);
      if (roomData && roomData.size > 1) {
        this.roomsMap.delete(room);
      }
    });
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return data;
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ): Promise<any> {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);

    const { room } = data;
    client.join(room);

    return data;
  }

  @SubscribeMessage('chatMessage')
  async chatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ): Promise<any> {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);

    const { room } = data;
    client.join(room);

    return data;
  }

  @SubscribeMessage('scanItem')
  async scanItem(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ScanItemDto,
  ): Promise<any> {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.log(`Scanned item id: ${data}`);

    this.io.to(data.userId).emit('scanItem', data.codeData);
    return data;
  }

  @SubscribeMessage('scanUser')
  async scanUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ScanUserDto,
  ): Promise<any> {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);

    this.io.to(`scanUser/${data.userId}`).emit('scanUser');
    return data;
  }
}
