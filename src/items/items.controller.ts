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
import { ItemsService } from './items.service';
import { CreateItemDto, ItemQueryParams, UpdateItemDto } from './items.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Post()
  async create(@Body() createDto: CreateItemDto) {
    await this.itemsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateItemDto) {
    console.log({ updateDto })
    await this.itemsService.update(id, updateDto);
  }

  @Get()
  async findAll(@Query() queryParams: ItemQueryParams) {
    return this.itemsService.findAll(queryParams);
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.itemsService.search(q);
  }

  @Get('countReport')
  async countReport() {
    return this.itemsService.countReport();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.itemsService.delete(id);
  }
}
