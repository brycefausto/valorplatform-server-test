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
import { CompaniesService } from './companies.service';
import {
  CompanyQueryParams,
  CreateCompanyDto,
  UpdateCompanyDto,
  UpdateCompanyLogoDto,
} from './company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createDto: CreateCompanyDto) {
    return await this.companiesService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateCompanyDto) {
    return await this.companiesService.update(id, updateDto);
  }

  @Put(':id/updateLogo')
  async updateLogo(
    @Param('id') id: string,
    @Body() updateDto: UpdateCompanyLogoDto,
  ) {
    await this.companiesService.updateLogo(id, updateDto);
  }

  @Get()
  async findAll(@Query() queryParams: CompanyQueryParams) {
    return this.companiesService.findAll(queryParams);
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.companiesService.search(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.companiesService.findBySlug(slug);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.companiesService.delete(id);
  }
}
