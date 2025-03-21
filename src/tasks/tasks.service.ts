import { BASE_URL } from '@/constants';
import { Injectable, Logger } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  // @Interval(5000)
  // async handleInterval() {
  //   try {
  //     await fetch(BASE_URL + "/");
  //   } catch (error) {
  //   }
  // }

  addTimeout(
    name: string,
    milliseconds: number,
    callback: () => void | Promise<void>,
  ) {
    const timeout = setTimeout(callback, milliseconds);
    if (!this.schedulerRegistry.doesExist('timeout', name)) {
      this.schedulerRegistry.addTimeout(name, timeout);
    }
  }

  deleteTimeout(name: string) {
    if (this.schedulerRegistry.doesExist('timeout', name)) {
      this.schedulerRegistry.deleteTimeout(name);
      this.logger.warn(`Timeout ${name} deleted!`);
    }
  }

  getTimeouts() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((key) => this.logger.log(`Timeout: ${key}`));
  }
}
