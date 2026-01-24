import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { TelegramAuthGuard } from '@app/auth/telegram-auth.guard';

// Define a minimal interface for the user attached by TelegramAuthGuard
interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
  role?: string;
}

interface AuthenticatedRequest {
  user?: TelegramUser;
  [key: string]: unknown;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @UseGuards(TelegramAuthGuard)
  async sendMessage(
    @Req() req: AuthenticatedRequest,
    @Body() body: SendMessageDto,
  ) {
    // Use authenticated user ID to prevent spoofing
    // Telegram user ID is a number, but ChatService uses string IDs
    const chatId = req.user?.id ? String(req.user.id) : body.chatId;

    return {
      response: await this.chatService.handleMessage(chatId, body.message),
    };
  }
}
