import { NestFactory } from '@nestjs/core';
import * as cors from 'cors'
import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express'
import { AppModule } from './app.module';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: '*'
  }));
  const staticPath = join(__dirname, '../..', 'uploads');
  app.use('/uploads', express.static(staticPath));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
