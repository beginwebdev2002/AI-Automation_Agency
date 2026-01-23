/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */


import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env.PORT || 3000;
  // app.setGlobalPrefix('api');
  // app.enableCors({
  //   // Разрешаем запросы только с твоего фронтенда на GitHub Pages
  //   origin: [
  //     'https://beginwebdev2002.github.io/',
  //     /\.github\.io$/,
  //     'http://localhost:4200' // Твой купленный домен
  //   ],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Accept, Authorization, x-telegram-init-data',
  //   credentials: true,
  // });
  app.enableCors({
    origin: true, // Разрешает запросы с любого источника (GitHub, Localhost)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: '*', // Принимает любые заголовки, включая Telegram Init Data
    maxAge: 3600,
  });
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`,
  );
}

bootstrap();
