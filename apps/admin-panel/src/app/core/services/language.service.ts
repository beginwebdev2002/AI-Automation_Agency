import { Injectable, signal, LOCALE_ID, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    currentLang = signal<string>('ru');
    supportedLanguages = [
        { code: 'ru', label: 'Русский', flag: '🇷🇺', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/ru/#/calculator' },
        { code: 'tj', label: 'Тоҷикӣ', flag: '🇹🇯', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/tj/#/calculator' },
        { code: 'en', label: 'English', flag: '🇺🇸', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/en/#/calculator' }
    ];

    public locale = inject(LOCALE_ID);
    private document = inject(DOCUMENT);

    constructor() {
        this.currentLang.set(this.locale);
    }

    switchLanguage(targetLang: string) {
        const href = this.supportedLanguages.find(l => l.code === targetLang)?.href;
        const documentHref = this.document.location.href;
        if (href && href !== documentHref) {
            this.document.location.href = href;
        }
    }
    getLanguage() {
        return this.supportedLanguages.find((lang) => lang.code === this.currentLang());
    }
}
