import { UserRole } from '@/schemas/appuser.schema';
import { Company } from '@/schemas/company.schema';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class UserDto {
  id: string;
  name: string;
  email?: string;
  idNumber?: number;
  role?: UserRole;
  company?: Company;
  phone?: string;
  address?: string;
  image?: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  idNumber?: number;

  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  companyId: string;

  phone?: string;
  address?: string;
}
export class UpdateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  idNumber?: number;

  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  companyId: string;

  phone?: string;
  address?: string;
}

export class UpdateImageDto {
  image: string;
}

export class UpdatePasswordDto {
  password: string;
  newPassword: string;
}

export class UpdatePasswordAdminDto extends UpdatePasswordDto {
  adminId: string;
}

export type UserQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};
