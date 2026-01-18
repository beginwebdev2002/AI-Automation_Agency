import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { TelegramModule } from './telegram/telegram.module';
import { UsersModule } from './users/users.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { QueueModule } from './queue/queue.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI_ONLINE,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env`,
    }),
    AuthModule,
    BookingModule,
    TelegramModule,
    UsersModule,
    TreatmentsModule,
    QueueModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

