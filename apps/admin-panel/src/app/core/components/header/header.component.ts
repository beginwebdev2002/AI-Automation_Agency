import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { LanguageService } from '../../services/language.service';
import { environment } from '../../../../environments/environment';

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
        const tg = window.Telegram?.WebApp;

        if (tg?.initDataUnsafe?.user) {
            const tgUser = tg.initDataUnsafe.user;

            const role = tgUser.id === environment.telegramAdminId ? 'admin' : 'client';

            this.user.set({
                name: tgUser.first_name,
                photoUrl: tgUser.photo_url || '',
                role: role
            });
        }
    }
}
