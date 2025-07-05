import { UserRole } from '@/schemas/appuser.schema';
import { Company } from '@/schemas/company.schema';

export class ResetPasswordDto {
  token: string;
  password: string;
}

export class UserPayload {
  id: string;
  email: string;
  role: UserRole;
  company: Company;
}
