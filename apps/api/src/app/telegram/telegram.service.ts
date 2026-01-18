import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { InjectBot, Start, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class TelegramService {
    constructor(@InjectBot() private bot: Telegraf<Context>) { }

    @Start()
    async start(ctx: Context) {
        await ctx.reply('Welcome');
    }
}
