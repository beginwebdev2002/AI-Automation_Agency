import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TelegramAuthGuard } from '../auth/telegram-auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('message')
    @UseGuards(TelegramAuthGuard)
    async sendMessage(@Body() body: { message: string; chatId: string }, @Req() req: any) {
        // We can use chatId from body or from the validated user in req.user
        // For TWA, the initData contains the user info.
        // Let's prefer the one from the validated token if available, or body if it's a generic endpoint.
        // But the requirement says "Receives { message: string, chatId: string }".

        return {
            response: await this.chatService.handleMessage(body.chatId, body.message)
        };
    }
}
