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
import { InventoryService } from './inventory.service';
import {
  CreateInventoryItemDto,
  InventoryQueryParams,
  UpdateInventoryItemDto,
} from './inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  async create(@Body() createDto: CreateInventoryItemDto) {
    await this.inventoryService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateInventoryItemDto) {
    await this.inventoryService.update(id, updateDto);
  }

  @Get()
  async findAll(@Query() queryParams: InventoryQueryParams) {
    return this.inventoryService.findAll(queryParams);
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.inventoryService.search(q);
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
  async delete(@Param('id') id: string) {
    this.inventoryService.delete(id);
  }
}
