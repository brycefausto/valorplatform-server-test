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
  CreateOrderDto,
  OrderQueryParams,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from './orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(@Body() createDto: CreateOrderDto) {
    return this.ordersService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateDto);
  }

  @Get()
  async findAll(@Query() queryParams: OrderQueryParams) {
    return this.ordersService.findAll(queryParams);
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.ordersService.search(q);
  }

  @Get('count')
  async count(@Query('vendorId') vendorId: string) {
    return this.ordersService.count(vendorId);
  }

  @Get('countReport')
  async countReport(@Query('vendorId') vendorId: string) {
    return this.ordersService.countReport(vendorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.ordersService.delete(id);
  }
}
