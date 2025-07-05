import { AddressInfo } from '@/schemas/address-info.schema';
import { CompanyDocument } from '@/schemas/company.schema';
import { WarehouseLocationDocument } from '@/schemas/warehouse-location.schema';
import { Model } from 'mongoose';

export const createCompanyData = async (
  companyModel: Model<CompanyDocument>,
  locationModel: Model<WarehouseLocationDocument>,
) => {
  let company = await companyModel.findOne();

  if (!company) {
    const address: AddressInfo = {
      address: '123 ABC St.',
      city: 'Asd City',
      state: 'Asd',
      zipCode: '1234',
      country: 'Philippines',
    };
    company = await companyModel.create({
      name: 'Valor',
      slug: 'valor',
      description: 'Test Description',
      email: 'valor@testmail.com',
      phone: '123-456-7890',
      logo: 'Valor_Logo_g1QJYyRSn.png?updatedAt=1751519806159',
      address,
    });
    await locationModel.create({
      name: 'Default Warehouse',
      address: { ...address },
    });
  } else {
    company = await companyModel.findOne();
  }

  return company as CompanyDocument;
};
