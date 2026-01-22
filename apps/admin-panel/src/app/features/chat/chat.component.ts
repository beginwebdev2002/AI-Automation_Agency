import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ChatService, Message } from './chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html'
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
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  onEnter(event: Event) {
    if (event instanceof KeyboardEvent && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
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
