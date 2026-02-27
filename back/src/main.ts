import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {AllExceptionsFilter} from "./common/all-exceptions.filter";
 
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, );
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  })
  app.enableCors({ origin: true, credentials: true, });
  app.use(cookieParser());
    app.set('trust proxy', 1);
    app.useGlobalFilters(new AllExceptionsFilter());    
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Автоматически преобразовывать JSON в объекты DTO
      whitelist: true, // Игнорировать поля, не описанные в DTO
      forbidNonWhitelisted: true, // Выбрасывать ошибку, если в запросе есть лишние поля
      transformOptions: { enableImplicitConversion: true }, // Преобразование типов (например, строка в число)
    }),
  );
  await app.listen(5000);
}
bootstrap();
  