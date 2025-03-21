import { fbMessaging } from '@/config/firebase-admin';
import { WEB_URL } from '@/constants';
import {
  AppNotification,
  AppNotificationDocument,
} from '@/schemas/appnotification.schema';
import { AppUser } from '@/schemas/appuser.schema';
import { UsersService } from '@/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, WebpushConfig } from 'firebase-admin/messaging';
import { identity, pickBy } from 'lodash';
import { PaginateModel } from 'mongoose';
import { MessagingData, MessagingQueryParams } from './messaging.dto';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(
    private usersService: UsersService,
    @InjectModel(AppNotification.name)
    private appNotificationModel: PaginateModel<AppNotificationDocument>,
  ) {}

  async registerToken(userId: string, token: string) {
    const appUser = await this.usersService.findOne(userId);

    appUser.messagingTokens = appUser.messagingTokens || [];

    if (!appUser.messagingTokens.includes(token)) {
      appUser.messagingTokens.push(token);
      await appUser.save();
    }
  }

  async pushMessage(
    appUser: AppUser,
    title: string,
    body: string,
    messagingData?: MessagingData,
  ) {
    try {
      appUser.messagingTokens = appUser.messagingTokens || [];
      const messages: Message[] = [];
      const { dataType, dataId } = messagingData || {};

      const notification = await this.appNotificationModel.create({
        userId: appUser.id,
        title,
        body,
        data: { dataType, dataId },
      });
      const _id = notification._id.toString();

      for (const token of appUser.messagingTokens) {
        const data = pickBy(
          {
            _id,
            title,
            body,
            dataType,
            dataId,
          },
          identity,
        ) as {
          [key: string]: string;
        };
        const webLink = dataType ? `${WEB_URL}/${dataType}` : null;
        const webpush: WebpushConfig = {
          data,
        };
        if (webLink) {
          webpush.fcmOptions = {
            link: webLink,
          };
          data.link = webLink;
        }
        messages.push({
          token,
          data,
          webpush,
        });
      }

      if (messages.length > 0) {
        this.logger.log('messages', messages);
        const res = await fbMessaging.sendEach(messages);
        console.log('res', res.responses);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async pushMessageToAdmins(
    title: string,
    content: string,
    messagingData?: MessagingData,
  ) {
    const adminUsers = await this.usersService.findByAdminRole();

    adminUsers.forEach((user) => {
      this.pushMessage(user, title, content, messagingData);
    });
  }

  async findByUserId(userId: string, queryParams: MessagingQueryParams) {
    const { page, limit = 10 } = queryParams;
    return await this.appNotificationModel.paginate(
      { userId },
      { page, limit, sort: { createdAt: -1 } },
    );
  }

  async delete(id: string) {
    await this.appNotificationModel.findByIdAndDelete(id).exec();
  }

  async deleteAllByUserId(userId: string) {
    await this.appNotificationModel.deleteMany({ userId }).exec();
  }
}
