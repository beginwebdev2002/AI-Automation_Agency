import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { GeminiService } from '@app/gemini/gemini.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  // Limit history to last 50 messages to save context and tokens
  private static readonly MAX_HISTORY = 50;

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private geminiService: GeminiService,
  ) {}

  async handleMessage(chatId: string, message: string): Promise<string> {
    // Optimized: Only fetch the last 50 messages using projection and lean()
    const chat = await this.chatModel
      .findOne({ chatId }, { history: { $slice: -ChatService.MAX_HISTORY } })
      .lean();

    // If chat exists, use its history, otherwise empty array
    const history = chat ? chat.history : [];

    // Prepare the new message
    const userMessage = { role: 'user', text: message, timestamp: new Date() };

    // Construct context: existing history + new message
    const historyContext = [...history, userMessage];

    // Ensure we only send the last MAX_HISTORY messages to AI
    const recentHistory = historyContext.slice(-ChatService.MAX_HISTORY);

    const historyForAi = recentHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const responseText = await this.geminiService.chatWithHistory(historyForAi);

    const modelMessage = {
      role: 'model',
      text: responseText,
      timestamp: new Date(),
    };

    // Update database: Push both messages. Create document if it doesn't exist.
    await this.chatModel.updateOne(
      { chatId },
      {
        $setOnInsert: { chatId },
        $push: {
          history: {
            $each: [userMessage, modelMessage],
            $slice: -ChatService.MAX_HISTORY,
          },
        },
      },
      { upsert: true },
    );

    return responseText;
  }
}
