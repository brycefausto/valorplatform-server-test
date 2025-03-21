require('dotenv').config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const defaultPassword = process.env.DEFAULT_PASSWORD || 'defaultpass';
