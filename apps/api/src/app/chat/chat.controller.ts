import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TelegramAuthGuard } from '../auth/telegram-auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('message')
    // @UseGuards(TelegramAuthGuard)
    async sendMessage(@Body() body: { message: string; chatId: string }, @Req() req: any) {
        console.log('Hello!', body);

        return {
            response: await this.chatService.handleMessage(body.chatId, body.message)
        };
    }
}
