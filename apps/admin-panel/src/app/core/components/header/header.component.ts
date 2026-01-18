import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { LanguageService } from '../../services/language.service';

// Define Telegram WebApp interface locally for now
interface TelegramWebApp {
    initDataUnsafe: {
        user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
        };
    };
}

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        LanguageSwitcherComponent
    ],
    templateUrl: './header.component.html',
    styleUrls: [] // We use Tailwind classes
})
export class HeaderComponent implements OnInit {
    languageService = inject(LanguageService);

    // State
    isMobileMenuOpen = signal(false);

    user = signal<{
        name: string;
        photoUrl: string;
        role: 'admin' | 'client' | 'guest';
    }>({
        name: 'Guest',
        photoUrl: '',
        role: 'guest'
    });

    // Computed
    isAdmin = computed(() => this.user().role === 'admin');

    ngOnInit() {
        this.initTelegramUser();
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }

    closeMobileMenu() {
        this.isMobileMenuOpen.set(false);
    }

    private initTelegramUser() {
        const tg = (window as any).Telegram?.WebApp as TelegramWebApp;

        if (tg?.initDataUnsafe?.user) {
            const tgUser = tg.initDataUnsafe.user;

            // Logic to determine role would typically involve a backend check.
            // For now, we'll default to 'client' if logged in via Telegram.
            // You can add a hardcoded check for your admin ID here for testing.
            // Example: const role = tgUser.id === 123456789 ? 'admin' : 'client';

            this.user.set({
                name: tgUser.first_name,
                photoUrl: tgUser.photo_url || '',
                role: 'client' // Default to client, update logic as needed
            });
        }
    }
}
