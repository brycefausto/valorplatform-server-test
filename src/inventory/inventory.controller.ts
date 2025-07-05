import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateInventoryDto,
  InventoryQueryParams,
  UpdateInventoryDto,
} from './inventory.dto';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createDto: CreateInventoryDto) {
    return await this.inventoryService.create(createDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateInventoryDto) {
    return await this.inventoryService.update(id, updateDto);
  }

  @Get()
  async findAll(@Query() queryParams: InventoryQueryParams) {
    return this.inventoryService.findAll(queryParams);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('companyId') companyId: string) {
    return this.inventoryService.search(q, companyId);
  }

  @Get('count')
  async count(@Query('companyId') companyId: string, @Query('vendorId') vendorId?: string) {
    return this.inventoryService.count(companyId, vendorId);
  }

  @Get('countReport')
  async countReport() {
    return this.inventoryService.countReport();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    this.inventoryService.delete(id);
  }
}
