import { APP_NAME, MAIL_DISABLED, MAIL_PASSWORD, MAIL_USER } from '@/constants';
import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { compileTemplate } from './template.utils';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

const mailFrom = `${APP_NAME} <${MAIL_USER}>`;

const logger = new Logger();

export const registeredAccountTemplate = 'registeredAccount.html';
export const requestResetPasswordTemplate = 'requestResetPassword.html';
export const resetPasswordTemplate = 'resetPassword.html';
export const deletedAccountTemplate = 'deletedAccount.html';
export const receivedOrderTemplate = 'receivedOrder.html';

export const sendMail = async (
  toEmail: string,
  subject: string,
  template: string,
  payload: any,
) => {
  if (!MAIL_DISABLED) {
    const copyrightYear = (new Date()).getFullYear()
    const mailOptions = {
      from: mailFrom,
      to: toEmail,
      subject,
      html: compileTemplate(template, { appName: APP_NAME, ...payload, copyrightYear }),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.log('Email sent: ' + info.response);
    } catch (error) {
      logger.error(error);
    }
  }
};
