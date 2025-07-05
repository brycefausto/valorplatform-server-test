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
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  ProductQueryParams,
  UpdateProductDto,
  UpdateProductImageDto,
} from './product.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { RequestWithUser } from '@/auth/auth.types';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createDto: CreateProductDto,
    @Request() request: RequestWithUser,
  ) {
    return await this.productsService.create(createDto, request.user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return await this.productsService.update(id, updateDto);
  }

  @Put(':id/updateImage')
  @UseGuards(AuthGuard)
  async updateImage(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductImageDto,
  ) {
    return await this.productsService.updateImage(id, updateDto);
  }

  @Put(':id/updateVariantImage')
  @UseGuards(AuthGuard)
  async updateVariantImage(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductImageDto,
  ) {
    return await this.productsService.updateVariantImage(id, updateDto);
  }

  @Get()
  async findAll(@Query() queryParams: ProductQueryParams) {
    return this.productsService.findAll(queryParams);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('companyId') companyId: string) {
    return this.productsService.search(q, companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('vendorId') vendorId: string) {
    return this.productsService.findOne(id, vendorId);
  }

  @Get('count')
  async count(@Query('companyId') companyId: string) {
    return this.productsService.count(companyId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.productsService.delete(id);
  }
}
