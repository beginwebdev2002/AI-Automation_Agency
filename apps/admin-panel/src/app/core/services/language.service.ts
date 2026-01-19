import { Injectable, signal, Inject, LOCALE_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    currentLang = signal<string>('ru');
    supportedLanguages = [
        { code: 'ru', label: 'Русский', flag: '🇷🇺', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/tj/#/calculator' },
        { code: 'tj', label: 'Тоҷикӣ', flag: '🇹🇯', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/tj/#/calculator' },
        { code: 'en', label: 'English', flag: '🇺🇸', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/en/#/calculator' }
    ];

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.currentLang.set(locale);
    }

    switchLanguage(targetLang: string) {
        const href = this.supportedLanguages.find(l => l.code === targetLang)?.href;
        let documentHref = this.document.location.href;
        if (href === documentHref) return;

        this.document.location.href = href!;
    }
    getLanguage() {
        return this.supportedLanguages.find((lang) => lang.code === this.currentLang());
    }
}
