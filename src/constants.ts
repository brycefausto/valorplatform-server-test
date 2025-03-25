require('dotenv').config();

export const ENV = process.env.NODE_ENV || 'development';
export const APP_NAME = process.env.APP_NAME || 'App Template';
export const MAIL_USER = process.env.MAIL_USER || 'test@testmail.com';
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || 'pass123';
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
export const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';
