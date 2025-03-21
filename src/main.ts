import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
require('dotenv').config();

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger();

  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', '../src/public'));
  app.setBaseViewsDir(join(__dirname, '..', '../src/views'));
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('API Server')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  logger.log(`Server started: http://localhost:${PORT}`);
}
bootstrap();
