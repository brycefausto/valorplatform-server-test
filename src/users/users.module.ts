import { EventsModule } from '@/events/events.module';
import { AppUserSchemaModule } from '@/schemas/appuser.schema';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CompanySchemaModule } from '@/schemas/company.schema';

@Module({
  imports: [AppUserSchemaModule, CompanySchemaModule, EventsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [AppUserSchemaModule, CompanySchemaModule, UsersService],
})
export class UsersModule {}
