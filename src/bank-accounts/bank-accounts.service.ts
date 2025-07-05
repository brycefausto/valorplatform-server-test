import { BankAccount, BankAccountDocument } from '@/schemas/bank-account.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { BankAccountQueryParams, CreateBankAccountDto, UpdateBankAccountDto } from './bank-account.dto';
import { omit } from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from '@/schemas/company.schema';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectModel(BankAccount.name)
    private bankAccountModel: PaginateModel<BankAccountDocument>,
    @InjectModel(Company.name)
    private companyModel: PaginateModel<CompanyDocument>,
  ) { }

  async create(createDto: CreateBankAccountDto) {
    const company = await this.companyModel.findById(createDto.companyId);

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    const bankAccount = new this.bankAccountModel(omit(createDto, 'companyId'));
    bankAccount.company = company;

    return await bankAccount.save();
  }

  async update(id: string, updateDto: UpdateBankAccountDto) {
    return this.bankAccountModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async findAll(queryParams: BankAccountQueryParams) {
    const { page, limit = 10, search } = queryParams;
    let query: any = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = {
        $or: [
          { bank: searchRegex },
          { accountHolder: searchRegex },
          { accountNumber: searchRegex },
          { swiftCode: searchRegex },
        ],
      };
    }

    return await this.bankAccountModel.paginate(query, {
      page,
      limit,
      sort: { name: 'asc' },
    });
  }

  async search(queryString: string) {
    const queryRegex = { $regex: queryString, $options: 'i' };
    return this.bankAccountModel.find({ name: queryRegex }).limit(10).exec();
  }

  async findOne(id: string) {
    return this.bankAccountModel.findById(id).exec();
  }

  async delete(id: string) {
    return await this.bankAccountModel.findByIdAndDelete(id).exec();
  }
}
