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
  const oneDriveUrl = 'https://my.microsoftpersonalcontent.com/personal/4c7b7a7050a7b69c/_layouts/15/download.aspx?UniqueId=ed9b35d3-e280-4f4f-830e-a0b92e21bb0e&Translate=false&tempauth=v1e.eyJzaXRlaWQiOiJmYzhkNDkzYi01ODFjLTQ0ZWEtODNkYS1iMTYyOTgyOTI3ZTciLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJleHAiOiIxNzY4ODYxNDUyIn0.BrylBiQ-rtpz2AmBJhOh0qyd8A9tpYcUkLX0P6ddiiMuDRZiATVAVFCqJmOQUy8LYfy6BMSafmaBBjKPceL7EVJ-zQFO-fMoN1O9TfYwsz5QWcVauSMGmEtTm9HjrfRi39vq6dWueSzSHXMd4eIMwlaZM8raLbSM35wJpp0eooipKz-XyECF_DQnQcG8AWNyu5oIfCb4kDg94usZCMzlNMIgo_maF5vwsd66s-6Sd1R58Ytv60bGeYoAzbnqiDCVsXCpb74n3ZDfTGdFFf5ooDuDpL2mjwgV05KdCKWNOVeZ-qLqQz4e_P54-wg8VEdhUOKP5lY8kOFm6K6xCv1PxKVQCiCcEpbAKYS6uFJ-pVJDbRQAEbfU2NjOJe_lp4xiD0cZYeA9e22kuSopB9TfLjpyNdNE-YQXspIozU-5sXs5M86cbwjXbOoA81P6w9BQ10f-yZZmdtBCG3FLzm8mjRjg_bamnrP8mIySWfWmp0Sm_umrGT8SN4guiICJITcvkxa-ulASjRHYJ6UfaTtfxA.t7bP0CfHeW_zZqWWgHtpUhNX3hxQJ10MdX8dNvRZjC0&ApiVersion=2.0';

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
