import { Injectable, signal, Inject, LOCALE_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    currentLang = signal<string>('ru');
    supportedLanguages = [
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
        { code: 'tj', label: 'Тоҷикӣ', flag: '🇹🇯' },
        { code: 'en', label: 'English', flag: '🇺🇸' }
    ];

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.currentLang.set(locale);
    }

    switchLanguage(targetLang: string) {
        if (this.currentLang() === targetLang) return;

        const { pathname, search, hash, origin } = this.document.location;
        const localeRegex = new RegExp(`/${this.locale}(/|$)`);

        let newPath = pathname;
        if (localeRegex.test(pathname)) {
            newPath = pathname.replace(localeRegex, `/${targetLang}$1`);
        } else {
            newPath = pathname.endsWith('/') ? `${pathname}${targetLang}/` : `${pathname}/${targetLang}/`;
        }

        this.document.location.href = `${origin}${newPath}${search}${hash}`;
    }
}
