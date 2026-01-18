import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../core/config/config.service';
import { LanguageSwitcherComponent } from '../../core/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LanguageSwitcherComponent],
  template: `
    <div class="flex flex-col h-screen bg-medical-rose-50">
      <!-- Header -->
      <div class="bg-white p-4 shadow-sm flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-medical-rose-100 flex items-center justify-center mr-3">
            <span class="text-2xl">🤖</span>
          </div>
          <div>
            <h1 class="font-serif text-lg text-gray-900" i18n="@@chatBotName">Dr. Beauty AI</h1>
            <p class="text-xs text-green-500" i18n="@@chatBotStatus">Online</p>
          </div>
        </div>
        <app-language-switcher></app-language-switcher>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div *ngFor="let msg of messages()" 
             [class.items-end]="msg.role === 'user'"
             [class.items-start]="msg.role === 'bot'"
             class="flex flex-col">
          <div [class.bg-medical-rose-500]="msg.role === 'user'"
               [class.text-white]="msg.role === 'user'"
               [class.bg-white]="msg.role === 'bot'"
               [class.text-gray-800]="msg.role === 'bot'"
               class="max-w-[80%] p-3 rounded-2xl shadow-sm text-sm">
            {{ msg.text }}
          </div>
          <span class="text-[10px] text-gray-400 mt-1">{{ msg.time | date:'shortTime' }}</span>
        </div>
        
        <div *ngIf="isLoading()" class="flex items-center space-x-2 text-gray-400 text-sm ml-2">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 bg-white border-t border-gray-100">
        <div class="flex gap-2">
          <input [(ngModel)]="newMessage" 
                 (keyup.enter)="sendMessage()"
                 placeholder="Ask about treatments..." 
                 i18n-placeholder="@@chatInputPlaceholder"
                 class="flex-1 bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-medical-rose-500 transition-all">
          <button (click)="sendMessage()" 
                  [disabled]="!newMessage.trim() || isLoading()"
                  class="bg-medical-rose-500 text-white p-3 rounded-xl hover:bg-medical-rose-600 disabled:opacity-50 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent {
  messages = signal<{ role: 'user' | 'bot', text: string, time: Date }[]>([
    { role: 'bot', text: $localize`:@@chatWelcomeMessage:Hello! I am your AI assistant. Ask me anything about our treatments.`, time: new Date() }
  ]);
  newMessage = '';
  isLoading = signal(false);

  constructor(private http: HttpClient, private configService: ConfigService) { }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userMsg = this.newMessage;
    this.messages.update(msgs => [...msgs, { role: 'user', text: userMsg, time: new Date() }]);
    this.newMessage = '';
    this.isLoading.set(true);

    const apiUrl = this.configService.get('BACKEND_URL_ONLINE') + '/chat';
    this.http.post<{ response: string }>(apiUrl, { message: userMsg }).subscribe({
      next: (res) => {
        this.messages.update(msgs => [...msgs, { role: 'bot', text: res.response, time: new Date() }]);
        this.isLoading.set(false);
      },
      error: () => {
        this.messages.update(msgs => [...msgs, { role: 'bot', text: $localize`:@@chatErrorMessage:Sorry, I encountered an error.`, time: new Date() }]);
        this.isLoading.set(false);
      }
    });
  }
}
