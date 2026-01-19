import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../core/config/config.service';
import { Observable } from 'rxjs';

declare const Telegram: any;

export interface Message {
    role: 'user' | 'bot';
    text: string;
    time: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private http = inject(HttpClient)
    private configService = inject(ConfigService)

    sendMessage(message: string, chatId = 'guest'): Observable<{ response: string }> {
        const apiUrl = this.configService.get('BACKEND_URL_ONLINE') + '/chat/message';
        console.log('api_url', apiUrl);


        let headers = new HttpHeaders();
        if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initData) {
            headers = headers.set('x-telegram-init-data', Telegram.WebApp.initData);
        }

        return this.http.post<{ response: string }>(apiUrl, { message, chatId }, { headers });
    }
}
