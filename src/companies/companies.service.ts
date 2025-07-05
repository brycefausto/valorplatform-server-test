import { Company, CompanyDocument } from '@/schemas/company.schema';
import {
  WarehouseLocation,
  WarehouseLocationDocument,
} from '@/schemas/warehouse-location.schema';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { merge, omit } from 'lodash';
import { PaginateModel } from 'mongoose';
import {
  CompanyQueryParams,
  CreateCompanyDto,
  UpdateCompanyDto,
  UpdateCompanyLogoDto,
} from './company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: PaginateModel<CompanyDocument>,
    private userService: UsersService,
    @InjectModel(WarehouseLocation.name)
    private locationModel: PaginateModel<WarehouseLocationDocument>,
  ) {}

  async create(createDto: CreateCompanyDto) {
    console.log({ createDto })
    const company = await this.companyModel.create(omit(createDto, 'user'));
    const user = await this.userService.create(
      merge(createDto.user, { company }),
    );
    await this.locationModel.create({
      name: 'Default Warehouse',
      address: company,
      company,
    });

    company.vendorId = user.id;

    return await company.save();
  }

  async update(id: string, updateDto: UpdateCompanyDto) {
    return this.companyModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async updateLogo(id: string, updateImageDto: UpdateCompanyLogoDto) {
    const { image } = updateImageDto;
    if (!image) {
      throw new BadRequestException('Logo Image is required.');
    }
    const company = await this.companyModel.findById(id).exec();

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    company.logo = image;
    await company.save();
  }

  async findAll(queryParams?: CompanyQueryParams) {
    const { page, limit = 10, search } = queryParams || {};
    let query: any = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = { name: searchRegex };
    }

    return await this.companyModel.paginate(query, {
      page,
      limit,
      sort: { name: 'asc' },
    });
  }

  async search(queryString: string) {
    const queryRegex = { $regex: queryString, $options: 'i' };
    return this.companyModel.find({ name: queryRegex }).limit(10).exec();
  }

  async findOne(id: string) {
    return this.companyModel.findById(id).exec();
  }

  async findBySlug(slug: string) {
    return this.companyModel.findOne({ slug }).exec();
  }

  async count() {
    return this.companyModel.find().estimatedDocumentCount();
  }

  async delete(id: string) {
    return await this.companyModel.findByIdAndDelete(id).exec();
  }
}
