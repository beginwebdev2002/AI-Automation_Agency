/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors({
    // Разрешаем запросы только с твоего фронтенда на GitHub Pages
    origin: [
      'https://beginwebdev2002.github.io/',
      'http://localhost:4200' // Твой купленный домен
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`,
  );
}

bootstrap();
