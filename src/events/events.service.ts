import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventsService {
  constructor(
    private eventsGateway: EventsGateway,
    private eventEmitter: EventEmitter2,
  ) {}

  async emitEvent(room: string, name: string, data?: any) {
    this.eventsGateway.io.to(room).emit(name, data);
  }

  async emitData(name: string, id?: string) {
    if (id) {
      this.eventsGateway.io.to(`${name}/${id}`).emit(`${name}/${id}`);
    }
    this.eventsGateway.io.to(name).emit(name);
    console.log(`${name} emitted`);

    if (name == 'item') {
      this.eventEmitter.emit('update-item-reports');
    } else if (name == 'transactions') {
      this.eventEmitter.emit('update-transaction-reports');
    }
  }
}
