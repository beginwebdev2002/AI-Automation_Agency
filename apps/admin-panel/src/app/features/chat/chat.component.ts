import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild, effect, HostListener, Renderer2, DestroyRef } from '@angular/core';
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
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private langugaeService = inject(LanguageService);
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);

  messages = signal<Message[]>([
    { role: 'bot', text: $localize`:@@chatWelcomeMessage:Здравствуйте! Я ваш персональный консультант клиники AAA Cosmetics. Чем я могу вам помочь сегодня?`, time: new Date() }
  ]);
  newMessage = '';
  isLoading = signal(false);
  showScrollButton = signal(false);

  private chatService = inject(ChatService);

  constructor() {
    effect(() => {
      this.messages();
      this.isLoading();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnInit() {
    this.scrollToBottom();
    const unlistenBody = this.renderer.listen(document.body, 'scroll', () => this.onBodyScroll());
    this.destroyRef.onDestroy(() => unlistenBody());
  }

  private scrollToBottom(): void {
    try {
      // Try all scroll targets
      window.scrollTo(0, document.documentElement.scrollHeight);
      document.body.scrollTop = document.body.scrollHeight; // For body scroll
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  scrollToBottomSmooth(): void {
    try {
      const el = this.scrollContainer?.nativeElement;
      const doc = document.documentElement;
      const body = document.body;

      if (doc.scrollHeight > window.innerHeight && window.scrollY > 0) {
         window.scrollTo({ top: doc.scrollHeight, behavior: 'smooth' });
      } else if (body.scrollHeight > body.clientHeight && body.scrollTop > 0) {
         body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
      } else if (el) {
         el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
         // Fallback if we are at top but need to scroll down (e.g. initial load but button somehow visible)
         // Default to window
         window.scrollTo({ top: doc.scrollHeight, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  updateScrollBtn(distance: number) {
    this.showScrollButton.set(distance > 100);
  }

  onDivScroll(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) this.updateScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const { scrollHeight, scrollTop } = document.documentElement;
    if (scrollHeight > window.innerHeight) {
        this.updateScrollBtn(scrollHeight - (window.scrollY || scrollTop) - window.innerHeight);
    }
  }

  onBodyScroll(): void {
    const { scrollHeight, scrollTop, clientHeight } = document.body;
    this.updateScrollBtn(scrollHeight - scrollTop - clientHeight);
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
