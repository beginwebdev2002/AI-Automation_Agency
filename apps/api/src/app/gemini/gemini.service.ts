import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Content, GenerativeModel } from '@google/generative-ai';
import * as mammoth from 'mammoth';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GeminiService implements OnModuleInit {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private context: string = '';

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY') || 'YOUR_API_KEY_HERE';
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async onModuleInit() {
        await this.loadContext();
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-pro',
            systemInstruction: this.buildSystemPrompt()
        });
    }

    private buildSystemPrompt(): string {
        return `
        You are a professional consultant for the AAA Cosmetics Clinic in Dushanbe.
        
        KNOWLEDGE BASE:
        ${this.context}
        
        INSTRUCTIONS:
        1. Answer in the user's language (Russian, Tajik, or English).
        2. ALWAYS provide prices in TJS (Somoni).
        3. Be polite, professional, and concise.
        4. If you don't know the answer based on the knowledge base, ask the user to contact the clinic directly.
        `;
    }

    private async loadContext() {
        try {
            // Look for chat-bot.docx in the root or project specific paths
            const docPath = path.join(process.cwd(), 'chat-bot.docx');
            if (fs.existsSync(docPath)) {
                const result = await mammoth.extractRawText({ path: docPath });
                this.context = result.value;
                console.log('Loaded chatbot context from docx');
            } else {
                console.warn('chat-bot.docx not found at', docPath);
                this.context = 'AAA Cosmetics Clinic services and information.';
            }
        } catch (error) {
            console.error('Error loading chatbot context:', error);
        }
    }

    async chat(message: string): Promise<string> {
        // Legacy method, keeping for backward compatibility if needed, but using new logic
        return this.chatWithHistory([{ role: 'user', parts: [{ text: message }] }]);
    }

    async chatWithHistory(history: Content[]): Promise<string> {
        try {
            // The last message is the new user message, the rest is history
            const lastMsg = history[history.length - 1];
            const previousHistory = history.slice(0, -1);

            const chat = this.model.startChat({
                history: previousHistory,
            });

            const result = await chat.sendMessage(lastMsg.parts[0].text);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            return 'Извините, в данный момент я не могу ответить. Пожалуйста, попробуйте позже.';
        }
    }
}
