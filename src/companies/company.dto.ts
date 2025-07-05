import { AddressInfo } from '@/schemas/address-info.schema';
import { CreateUserDto } from '@/users/users.dto';

export class CreateCompanyDto {
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: AddressInfo;
  user: CreateUserDto;
}

export class UpdateCompanyLogoDto {
  image: string;
}

export class UpdateCompanyDto {
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export class CompanyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
