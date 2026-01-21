import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ChatService, Message } from './chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  styleUrl: './chat.component.scss',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-1 flex-col bg-gradient-to-b from-rose-50 to-white mb-20">
      <!-- Header -->
      <div class="bg-white/80 backdrop-blur-md p-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-rose-100">
        <div class="flex items-center">
          <div class="relative">
            <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-200 to-rose-100 flex items-center justify-center mr-3 shadow-inner border border-white">
              <span class="text-2xl">👩‍⚕️</span>
            </div>
            <div class="absolute bottom-0 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 class="font-serif text-lg text-gray-800 font-medium tracking-wide" i18n="@@chatBotName">AI Консультант</h1>
            <p class="text-xs text-rose-400 font-medium" i18n="@@chatBotStatus">Онлайн 24/7</p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        @for (msg of messages(); track msg.time) {
          <div 
               [class.items-end]="msg.role === 'user'"
               [class.items-start]="msg.role === 'bot'"
               class="flex flex-col animate-fade-in-up">
            
            <div [class.bg-gradient-to-br]="msg.role === 'user'"
                 [class.from-rose-500]="msg.role === 'user'"
                 [class.to-rose-600]="msg.role === 'user'"
                 [class.text-white]="msg.role === 'user'"
                 [class.rounded-br-none]="msg.role === 'user'"
                 
                 [class.bg-white]="msg.role === 'bot'"
                 [class.text-gray-700]="msg.role === 'bot'"
                 [class.border]="msg.role === 'bot'"
                 [class.border-rose-100]="msg.role === 'bot'"
                 [class.rounded-bl-none]="msg.role === 'bot'"
                 [class.shadow-sm]="msg.role === 'bot'"
                 
                 class="max-w-[500px] p-4 rounded-2xl text-[15px] leading-relaxed relative group">
              
              @if (msg.role === 'bot') {
                <div class="absolute -left-2 top-0 w-2 h-2 bg-white border-t border-l border-rose-100 [clip-path:polygon(100%_0,0_0,100%_100%)]"></div>
              }
              @if (msg.role === 'user') {
                <div class="absolute -right-2 top-0 w-2 h-2 bg-rose-500 [clip-path:polygon(0_0,100%_0,0_100%)]"></div>
              }
              <p [innerHTML]="msg.text"></p>
            </div>
            <span class="text-[10px] text-gray-400 mt-1.5 px-1 font-medium select-none">
              {{ msg.time | date:'HH:mm' }}
            </span>
          </div>
        }
        
        <!-- Typing Indicator -->
        @if (isLoading()) {
          <div class="flex items-center space-x-1.5 ml-2 p-3 bg-white rounded-2xl rounded-bl-none border border-rose-100 w-fit shadow-sm">
            <div class="w-2 h-2 bg-rose-300 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-rose-300 rounded-full animate-bounce delay-75"></div>
            <div class="w-2 h-2 bg-rose-300 rounded-full animate-bounce delay-150"></div>
          </div>
        }
      </div>

      <!-- Input Area -->
      <div class="p-3 bg-white border-t border-rose-100 pb-safe fixed bottom-2 w-full">
        <div class="flex gap-2 ml-2 mr-6 items-end bg-gray-50 p-1.5 rounded-[24px] border border-gray-200 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
          <textarea [(ngModel)]="newMessage" 
                    (keydown.enter)="onEnter($event)"
                    rows="1"
                    placeholder="Задайте вопрос о процедурах..." 
                    i18n-placeholder="@@chatInputPlaceholder"
                    class="flex-1 bg-transparent border-0 rounded-xl px-4 py-3 focus:ring-0 text-gray-700 placeholder-gray-400 resize-none max-h-32 min-h-[44px]"></textarea>
          
          <button (click)="sendMessage()" 
                  [disabled]="!newMessage.trim() || isLoading()"
                  class="bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 transition-all shadow-md active:scale-95 mb-0.5 mr-0.5">
            <svg class="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pb-safe {
      padding-bottom: env(safe-area-inset-bottom, 16px);
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ChatComponent implements AfterViewChecked, OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private langugaeService = inject(LanguageService);

  messages = signal<Message[]>([
    { role: 'bot', text: $localize`:@@chatWelcomeMessage:Здравствуйте! Я ваш персональный консультант клиники AAA Cosmetics. Чем я могу вам помочь сегодня?`, time: new Date() }
  ]);
  newMessage = '';
  isLoading = signal(false);

  private chatService = inject(ChatService);

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  onEnter(event: Event) {
    event.preventDefault();
    this.sendMessage();
  }
  private userData() {
        const tg = window.Telegram?.WebApp;
        if (!tg) return null;
        return tg.initDataUnsafe?.user;
    }

  sendMessage() {
    if (!this.newMessage.trim() || this.isLoading()) return;
    const userData = this.userData();
    const language = this.langugaeService.getLanguage();

    let userMsg = this.newMessage.trim();

    this.messages.update(msgs => [...msgs, { role: 'user', text: userMsg, time: new Date() }]);
    this.newMessage = '';
    this.isLoading.set(true);

    // Haptic Feedback
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
      Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    // Get Chat ID from Telegram if available
    let chatId = 'guest';
    if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initDataUnsafe?.user?.id) {
      chatId = Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    userMsg = `
      user prompt: ${userMsg}
      language of response must be ${language?.code}
      user Info:${userData ? JSON.stringify(userData) : 'Doesnt have user data'}
    `;

    this.chatService.sendMessage(userMsg, chatId).subscribe({
      next: (res) => {
        this.messages.update(msgs => [...msgs, { role: 'bot', text: res.response, time: new Date() }]);
        this.isLoading.set(false);
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
          Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
      },
      error: () => {
        this.messages.update(msgs => [...msgs, { role: 'bot', text: $localize`:@@chatErrorMessage:Извините, произошла ошибка. Попробуйте позже.`, time: new Date() }]);
        this.isLoading.set(false);
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
          Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
      }
    });
  }
}
