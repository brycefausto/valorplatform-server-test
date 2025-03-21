import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdatePasswordAdminDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserQueryParams,
} from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createDto: CreateUserDto) {
    return await this.usersService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return await this.usersService.update(id, updateDto);
  }

  @Put(':id/updatePassword')
  async updatePassword(
    @Param('id') id: string,
    @Body() updateDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(id, updateDto);
  }

  @Put(':id/updatePasswordAdmin')
  async updatePasswordAdmin(
    @Param('id') id: string,
    @Body() updateDto: UpdatePasswordAdminDto,
  ) {
    return await this.usersService.updatePasswordAdmin(id, updateDto);
  }

  @Get()
  async findAll(@Query() queryParams: UserQueryParams) {
    return this.usersService.findAll(queryParams);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('userFilter') userFilter: string) {
    return this.usersService.search(q, userFilter);
  }

  @Get('idNumber/:id')
  async findByIdNumber(@Param('id') id: string) {
    return this.usersService.findByIdNumber(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
  }
}
