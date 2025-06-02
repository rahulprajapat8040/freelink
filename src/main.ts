import { NestFactory } from '@nestjs/core';
import * as cors from 'cors'
import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: '*'
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
