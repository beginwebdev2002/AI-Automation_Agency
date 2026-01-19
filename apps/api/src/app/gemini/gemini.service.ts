import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Content, GenerativeModel } from '@google/generative-ai';
import axios from 'axios';
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
            model: 'gemini-2.5-flash',
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
        5. Answer the questions depends on User Personal Information.
        6. FORMATTING RULES:
            - Use HTML for all responses.
            - Set style for every tag with inline styles (do not use CSS classes, do not use external CSS files). 
            - Approved inline styles: margin(min: 5px, max: 20px), background-color, color, font-weight, font-family.
            - Use <strong>bold text</strong> for prices and service names.
            - Use <table> for tables of services or preparation steps.
            - Use <img> for images of services or preparation steps. max width/height 200px
            - Use <ul><li>bullet points</li></ul> for lists of services or preparation steps. set margin between bullet points 10px
            - Use <h3>Headings</h3> to separate different topics.
            - Keep <p>paragraphs short (maximum 2-3 sentences)</p>
            - Use <hr> horizontal rules to separate sections if the answer is long.
        
        `;
    }


private async loadContext() {
  // Замените на вашу прямую ссылку из Шага 1
  const oneDriveUrl = 'https://onedrive.live.com/personal/4c7b7a7050a7b69c/_layouts/15/download.aspx?UniqueId=708fffd2%2Db8be%2D4b09%2Dbea5%2D66b2284a4211';

  try {
    // 1. Скачиваем файл как массив байтов (arraybuffer)
    const response = await axios.get(oneDriveUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // 2. mammoth умеет работать с буфером вместо пути к файлу
    const result = await mammoth.extractRawText({ buffer: buffer });
    
    this.context = result.value;
    console.log('✅ База знаний успешно загружена из OneDrive');

  } catch (error) {
    console.error('❌ Ошибка загрузки контекста из OneDrive:', error.message);
    // Фолбэк (запасной вариант) на случай проблем с сетью
    this.context = 'AAA Cosmetics Clinic services and information.';
  }
}

    async chat(message: string): Promise<string> {
        // Legacy method, keeping for backward compatibility if needed, but using new logic
        return this.chatWithHistory([{ role: 'user', parts: [{ text: message }] }]);
    }

    async chatWithHistory(history: Content[]): Promise<string> {
        try {
            // Prepend system instruction to history for gemini-pro compatibility
            const systemPrompt = this.buildSystemPrompt();
            const historyWithSystem = [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: 'Understood. I am ready to act as the AAA Cosmetics consultant.' }] },
                ...history.slice(0, -1) // Previous history
            ];

            const lastMsg = history[history.length - 1];

            const chat = this.model.startChat({
                history: historyWithSystem,
            });

            const result = await chat.sendMessage(lastMsg.parts[0].text);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', JSON.stringify(error, null, 2));
            if (error instanceof Error) {
                console.error('Error message:', error.message);
            }
            return 'Извините, в данный момент я не могу ответить. Пожалуйста, попробуйте позже.';
        }
    }
}
