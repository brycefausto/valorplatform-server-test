import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { AppLoggerMiddleware } from './logger/logger.middleware';
import { RolesGuard } from './roles/roles.guard';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { TasksModule } from './tasks/tasks.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductsModule } from './products/products.module';
import { CompaniesModule } from './companies/companies.module';
import { OrdersModule } from './orders/orders.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    EventsModule,
    SeedModule,
    TasksModule,
    InventoryModule,
    ProductsModule,
    CompaniesModule,
    OrdersModule,
    BankAccountsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
