import { UserPayload } from '@/auth/auth.dto';
import { WEB_URL } from '@/constants';
import { AppUser, AppUserDocument, UserRole } from '@/schemas/appuser.schema';
import { Company, CompanyDocument } from '@/schemas/company.schema';
import {
  deletedAccountTemplate,
  registeredAccountTemplate,
  sendMail,
} from '@/utils/email.utils';
import { comparePassword } from '@/utils/password.utils';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { omit } from 'lodash';
import { PaginateModel } from 'mongoose';
import {
  CreateUserDto,
  UpdateImageDto,
  UpdatePasswordAdminDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserDto,
  UserQueryParams,
} from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(AppUser.name)
    private appUserModel: PaginateModel<AppUserDocument>,
    @InjectModel(Company.name)
    private companyModel: PaginateModel<CompanyDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createDto: CreateUserDto) {
    const { email, idNumber } = createDto;
    const emailQuery = { email: { $regex: `^${email}$`, $options: 'i' } };
    const regexQueries: any[] = [emailQuery];
    if (idNumber) {
      const idNumberQuery = {
        idNumber: { $regex: `^${idNumber}$`, $options: 'i' },
      };
      regexQueries.push(idNumberQuery);
    }
    const existingUser = await this.appUserModel.findOne({
      $or: regexQueries,
    });

    if (existingUser) {
      throw new ConflictException('The email/ID Number already exists.');
    }

    const appUser = new this.appUserModel(omit(createDto, ['companyId']));

    if (createDto.companyId) {
      const company = await this.companyModel.findById(createDto.companyId);
      if (company) {
        appUser.company = company;
      }
    }

    const newUser = (await appUser.save()) as UserDto;

    sendMail(appUser.email, 'Account Registered', registeredAccountTemplate, {
      name: appUser.name,
      link: WEB_URL,
    });

    return newUser;
  }

  async createCustomer(createDto: CreateUserDto) {
    createDto.role = UserRole.CUSTOMER;
    return this.create(createDto);
  }

  async update(id: string, updateDto: UpdateUserDto) {
    const { email, idNumber: idNumber } = updateDto;
    const appUser = await this.appUserModel.findById(id).exec();

    if (!appUser) {
      throw new NotFoundException('User not found.');
    }

    const emailRegex = { $regex: `^${email}$`, $options: 'i' };
    const idNumberRegex = { $regex: `^${idNumber}$`, $options: 'i' };
    const existingUser = await this.appUserModel.findOne({
      $or: [{ email: emailRegex }, { idNumber: idNumberRegex }],
    });

    if (existingUser && existingUser.id !== appUser.id) {
      throw new ConflictException('The email/email/ID Number already exists.');
    }

    appUser.set(omit(updateDto, ['sectionId', 'subjectIds', 'companyId']));

    if (updateDto.companyId) {
      const company = await this.companyModel.findById(updateDto.companyId);

      if (company) {
        appUser.company = company;
      }
    }

    const newUser = (await appUser.save()) as UserDto;

    return newUser;
  }

  async updateImage(id: string, updateImageDto: UpdateImageDto) {
    const { image } = updateImageDto;
    if (!image) {
      throw new BadRequestException('Image is required.');
    }
    const appUser = await this.appUserModel.findById(id).exec();

    if (!appUser) {
      throw new NotFoundException('User not found.');
    }

    appUser.image = image;
    await appUser.save();
  }

  async updatePassword(
    id: string,
    { password, newPassword }: UpdatePasswordDto,
  ) {
    console.log({ password, newPassword });
    const appUser = await this.appUserModel.findById(id).exec();

    if (!appUser) {
      throw new NotFoundException('User not found.');
    }

    if (comparePassword(password, appUser.password)) {
      appUser.password = newPassword;
      await appUser.save();
    } else {
      throw new BadRequestException('The current password is incorrect.');
    }
  }

  async updatePasswordAdmin(
    id: string,
    { adminId, password, newPassword }: UpdatePasswordAdminDto,
  ) {
    console.log({ password, newPassword });
    const appUser = await this.appUserModel.findById(id).exec();

    if (!appUser) {
      throw new NotFoundException('User not found.');
    }

    const adminUser = await this.appUserModel.findById(adminId).exec();

    if (!adminUser) {
      throw new NotFoundException('Admin not found.');
    }

    if (comparePassword(password, adminUser.password)) {
      appUser.password = newPassword;
      await appUser.save();
    } else {
      throw new BadRequestException('The current password is incorrect.');
    }
  }

  async findAll(queryParams: UserQueryParams, user: UserPayload) {
    const company = user.role != UserRole.SUPER_ADMIN ? user.company : null;
    const { page, limit = 10, search } = queryParams;
    let query = {};

    if (company) {
      query = { company };
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = {
        ...query,
        $or: [{ name: searchRegex }, { email: searchRegex }],
      };
    }

    return await this.appUserModel.paginate(query, {
      page,
      limit,
    });
  }

  async search(queryString: string, userFilter: string) {
    const queryRegex = { $regex: queryString, $options: 'i' };
    const query: any = {
      $or: [
        { name: queryRegex },
        { email: queryRegex },
        { email: queryRegex },
        { idNumber: queryRegex },
      ],
    };

    if (userFilter == 'nonAdmin') {
      query.role = {
        $ne: UserRole.ADMIN,
      };
    }

    return this.appUserModel.find(query, '-password').limit(10).exec();
  }

  async findOne(id: string) {
    const appUser = await this.appUserModel.findById(id, '-password').exec();

    if (!appUser) {
      throw new NotFoundException('User not found.');
    }

    return appUser;
  }

  async findByIdNumber(id: string) {
    const appUser = await this.appUserModel
      .findOne({ idNumber: id }, '-password')
      .exec();

    if (!appUser) {
      throw new NotFoundException('User not found.');
    }

    return appUser;
  }

  async findByEmail(email: string) {
    const emailRegex = { $regex: `^${email}$`, $options: 'i' };
    return this.appUserModel
      .findOne({ email: emailRegex })
      .select('+password')
      .exec();
  }

  async count(companyId?: string) {
    if (!companyId) {
      return this.appUserModel.countDocuments();
    }
    return this.appUserModel.countDocuments({ company: companyId });
  }

  async findByAdminRole() {
    return this.appUserModel.find({ role: UserRole.ADMIN }).exec();
  }

  async delete(id: string) {
    this.eventEmitter.emit('delete-user', id);
    const appUser = await this.appUserModel.findByIdAndDelete(id).exec();

    if (!appUser) {
      throw new NotFoundException('User not found.');
    }

    sendMail(appUser.email, 'Account Deleted', deletedAccountTemplate, {
      name: appUser.name,
    });

    return appUser;
  }
}
