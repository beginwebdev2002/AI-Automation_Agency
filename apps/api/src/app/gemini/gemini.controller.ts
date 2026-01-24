import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('chat')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post()
  // @UseGuards(TelegramAuthGuard) // Optional: Enable if you want to restrict to TWA users
  async chat(@Body() body: { message: string }) {
    const response = await this.geminiService.chat(body.message);
    return { response };
  }
}
