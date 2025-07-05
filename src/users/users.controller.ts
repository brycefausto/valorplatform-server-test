import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateImageDto,
  UpdatePasswordAdminDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserQueryParams,
} from './users.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@/auth/auth.guard';
import { RequestWithUser } from '@/auth/auth.types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createDto: CreateUserDto) {
    return await this.usersService.create(createDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return await this.usersService.update(id, updateDto);
  }

  @Put(':id/updateImage')
  @UseGuards(AuthGuard)
  async updateImage(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return await this.usersService.updateImage(id, updateImageDto);
  }

  @Put(':id/updatePassword')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Param('id') id: string,
    @Body() updateDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(id, updateDto);
  }

  @Put(':id/updatePasswordAdmin')
  @UseGuards(AuthGuard)
  async updatePasswordAdmin(
    @Param('id') id: string,
    @Body() updateDto: UpdatePasswordAdminDto,
  ) {
    return await this.usersService.updatePasswordAdmin(id, updateDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() queryParams: UserQueryParams, @Request() request: RequestWithUser,) {
    return this.usersService.findAll(queryParams, request.user);
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
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
  }
}
