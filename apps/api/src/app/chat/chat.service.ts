import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);

    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        private geminiService: GeminiService
    ) { }

    async handleMessage(chatId: string, message: string): Promise<string> {
        let chat = await this.chatModel.findOne({ chatId });
        if (!chat) {
            chat = new this.chatModel({ chatId, history: [] });
        }

        chat.history.push({ role: 'user', text: message, timestamp: new Date() });

        const historyForAi = chat.history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const responseText = await this.geminiService.chatWithHistory(historyForAi);

        chat.history.push({ role: 'model', text: responseText, timestamp: new Date() });
        await chat.save();

        return responseText;
    }
}
