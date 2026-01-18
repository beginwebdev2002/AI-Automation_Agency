import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { InjectBot, Start, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class TelegramService {
    private tg = (window as any).Telegram?.WebApp;

    constructor(@InjectBot() private bot: Telegraf<Context>) {
        this.tg.ready();
        this.tg.expand();
    }

    @Start()
    async start(ctx: Context) {
        await ctx.reply('Welcome');
    }
}
