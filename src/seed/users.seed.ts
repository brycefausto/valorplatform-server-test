import { AppUserDocument, UserRole } from '@/schemas/appuser.schema';
import { CompanyDocument } from '@/schemas/company.schema';
import { Model } from 'mongoose';

export const createSuperAdminData = async (
  appUserModel: Model<AppUserDocument>,
) => {
  const count = await appUserModel.estimatedDocumentCount({
    role: UserRole.SUPER_ADMIN,
  });

  if (count == 0) {
    const users = [
      {
        name: 'Super Admin',
        email: 'admin@testmail.com',
        password: 'adminpass123',
        role: UserRole.SUPER_ADMIN,
        phone: '123-456-7890',
        address: '789 Elm Rd, Othercity, TX 75000',
      },
    ];

    await appUserModel.create(users);
  }
};

export const createUserData = async (
  appUserModel: Model<AppUserDocument>,
  company: CompanyDocument,
) => {
  const count = await appUserModel.estimatedDocumentCount();

  if (count == 1) {
    const users = [
      {
        name: 'John Doe',
        email: 'john@testmail.com',
        password: 'john123',
        role: UserRole.ADMIN,
        company,
        phone: '123-456-7890',
        address: '789 Elm Rd, Othercity, TX 75000',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'jane123',
        role: UserRole.DISTRIBUTOR,
        company,
        phone: '123-456-7891',
        address: '101 Maple Ln, Bigcity, IL 60601',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'bob123',
        role: UserRole.VIP,
        company,
        phone: '123-456-7892',
        address: '456 Pine Ave, Someville, NY 10001',
      },
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: 'alice123',
        role: UserRole.RESELLER,
        company,
        phone: '123-456-7890',
        address: '123 Oak St, Anytown, CA 91234',
      },
    ];

    const createdUsers = await appUserModel.create(users);

    company.vendorId = createdUsers[0].id;
    await company.save()

    return createdUsers
  }
};
