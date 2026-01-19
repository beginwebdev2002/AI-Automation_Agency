import { Injectable, signal, Inject, LOCALE_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    currentLang = signal<string>('ru');
    supportedLanguages = [
        { code: 'ru', label: 'Русский', flag: '🇷🇺', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/ru/#/' },
        { code: 'tj', label: 'Тоҷикӣ', flag: '🇹🇯', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/tj/#/' },
        { code: 'en', label: 'English', flag: '🇺🇸', href: 'https://beginwebdev2002.github.io/AI-Automation_Agency/en/#/' }
    ];

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.currentLang.set(locale);
    }

    switchLanguage(targetLang: string) {
        if (this.currentLang() === targetLang) return;

        this.document.location.href = `${this.supportedLanguages.find(l => l.code === targetLang)?.href}`;
    }
}
