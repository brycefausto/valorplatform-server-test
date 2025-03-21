import { EventsModule } from '@/events/events.module';
import { AppUserSchemaModule } from '@/schemas/appuser.schema';
import { SectionSchemaModule } from '@/schemas/section.schema';
import { SubjectSchemaModule } from '@/schemas/subject.schema';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DepartmentSchemaModule } from '@/schemas/department.schema';

@Module({
  imports: [
    AppUserSchemaModule,
    SectionSchemaModule,
    DepartmentSchemaModule,
    SubjectSchemaModule,
    EventsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [AppUserSchemaModule, UsersService],
})
export class UsersModule {}
