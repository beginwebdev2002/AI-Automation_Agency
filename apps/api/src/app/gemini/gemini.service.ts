import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as mammoth from 'mammoth';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GeminiService implements OnModuleInit {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private context: string = '';

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY') || 'YOUR_API_KEY_HERE';
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async onModuleInit() {
        await this.loadContext();
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
                this.context = 'You are a helpful assistant for AAA Cosmetics clinic.';
            }
        } catch (error) {
            console.error('Error loading chatbot context:', error);
        }
    }

    async chat(message: string): Promise<string> {
        const prompt = `
      Context: ${this.context}
      
      User Question: ${message}
      
      Answer as a helpful assistant for the clinic. Keep answers concise and professional.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            return 'Sorry, I am having trouble answering that right now.';
        }
    }
}
