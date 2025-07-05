import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountSchemaModule } from '@/schemas/bank-account.schema';
import { CompanySchemaModule } from '@/schemas/company.schema';

@Module({
  imports: [
    BankAccountSchemaModule,
    CompanySchemaModule
  ],
  providers: [BankAccountsService],
  controllers: [BankAccountsController]
})
export class BankAccountsModule {}
