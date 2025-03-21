import { UserRole } from '@/schemas/appuser.schema';

export class UserDto {
  name: string;
  email?: string;
  idNumber?: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  image?: string;
}

export class CreateUserDto {
  name: string;
  email?: string;
  idNumber?: string;
  password: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  image?: string;
}

export class UpdateUserDto {
  name: string;
  email?: string;
  idNumber?: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  image?: string;
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
