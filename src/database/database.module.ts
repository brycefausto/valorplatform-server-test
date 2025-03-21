import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SQLiteModule } from './sqlite.module';

const MongooseConnectionModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => ({
    uri: config.get('database.url'),
  }),
  inject: [ConfigService],
});

@Module({
  imports: [MongooseConnectionModule, SQLiteModule],
})
export class DatabaseModule {}
