import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingQueryParams } from './messaging.dto';

@Controller('messaging')
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Post('registerToken/:id')
  async registerToken(
    @Param('id') userId: string,
    @Body() { token }: { token: string },
  ) {
    await this.messagingService.registerToken(userId, token);
  }

  @Post('testMessage')
  async testMessage() {
    await this.messagingService.pushMessageToAdmins(
      'Test Notification',
      'This is a test message from notification.',
      { dataType: 'transactions' },
    );
  }

  @Get('notifications/:id')
  async findAllByUserId(
    @Param('id') userId: string,
    @Query() queryParams: MessagingQueryParams,
  ) {
    return await this.messagingService.findByUserId(userId, queryParams);
  }

  @Delete('notifications/all/:userId')
  async deleteAllByUserId(@Param('userId') userId: string) {
    await this.messagingService.deleteAllByUserId(userId);
  }

  @Delete('notifications/:id')
  async delete(@Param('id') id: string) {
    await this.messagingService.delete(id);
  }
}
