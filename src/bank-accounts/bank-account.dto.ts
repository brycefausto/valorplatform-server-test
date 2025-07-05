export class CreateBankAccountDto {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  swiftCode: string;
  companyId: string;
}

export class UpdateBankAccountDto {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  swiftCode: string;
  forTransfer: boolean;
}

export class BankAccountQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
