import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { ConfigService } from '@nestjs/config';
@Module({
    imports: [
        TelegrafModule.forRootAsync({
            // 1. Указываем, какие сервисы нужно внедрить (инжектировать)
            inject: [ConfigService],
            // 2. Используем фабрику для создания конфигурации
            useFactory: (config: ConfigService) => ({
                token: config.get<string>('TELEGRAM_TOKEN') || '',
            }),
        }),
    ],
    controllers: [],
    providers: [TelegramService],
})
export class TelegramModule { }
