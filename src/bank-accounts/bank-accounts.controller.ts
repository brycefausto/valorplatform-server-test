import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountQueryParams, CreateBankAccountDto, UpdateBankAccountDto } from './bank-account.dto';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('bank-accounts')
export class BankAccountsController {
   constructor(private bankAccountService: BankAccountsService) {}
  
    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() createDto: CreateBankAccountDto) {
      await this.bankAccountService.create(createDto);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') id: string, @Body() updateDto: UpdateBankAccountDto) {
      await this.bankAccountService.update(id, updateDto);
    }
  
    @Get()
    async findAll(@Query() queryParams: BankAccountQueryParams) {
      return this.bankAccountService.findAll(queryParams);
    }
  
    @Get('search')
    async search(@Query('q') q: string) {
      return this.bankAccountService.search(q);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.bankAccountService.findOne(id);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string) {
      this.bankAccountService.delete(id);
    }
}
