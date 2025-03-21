import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { UsersModule } from '@/users/users.module';
import { AppNotificationSchemaModule } from '@/schemas/appnotification.schema';

@Module({
  imports: [UsersModule, AppNotificationSchemaModule],
  providers: [MessagingService],
  controllers: [MessagingController],
  exports: [MessagingService],
})
export class MessagingModule {}
