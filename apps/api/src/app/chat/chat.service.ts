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
        // 1. Retrieve or create chat history
        let chat = await this.chatModel.findOne({ chatId });
        if (!chat) {
            chat = new this.chatModel({ chatId, history: [] });
        }

        // 2. Add user message to history
        chat.history.push({ role: 'user', text: message, timestamp: new Date() });

        // 3. Prepare history for Gemini (convert to Gemini format if needed)
        // For now, we'll just pass the last few messages or the whole history depending on context window.
        // Simple approach: Pass the current message and let GeminiService handle the context/system prompt.
        // However, to be "context-aware", we should pass history.

        // Let's assume GeminiService can handle history or we construct the prompt here.
        // We will update GeminiService to accept history.

        const historyForAi = chat.history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // 4. Get response from Gemini
        const responseText = await this.geminiService.chatWithHistory(historyForAi);

        // 5. Add bot response to history
        chat.history.push({ role: 'model', text: responseText, timestamp: new Date() });
        await chat.save();

        return responseText;
    }
}
