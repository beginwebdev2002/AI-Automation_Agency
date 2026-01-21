import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('message')
    // @UseGuards(TelegramAuthGuard)
    async sendMessage(@Body() body: SendMessageDto) {
        console.log('Hello!', body);

        return {
            response: await this.chatService.handleMessage(body.chatId, body.message)
        };
    }
}
