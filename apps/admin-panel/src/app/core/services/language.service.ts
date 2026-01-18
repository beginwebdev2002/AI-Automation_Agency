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
        // Angular's LOCALE_ID might be 'ru-RU' or just 'ru' depending on setup.
        // We normalize it to our supported codes if possible, or just use it.
        // Given project.json sourceLocale is 'ru', it should be 'ru'.
        this.currentLang.set(locale);
    }

    switchLanguage(targetLang: string) {
        if (this.locale === targetLang) return;

        const currentPath = this.document.location.pathname;
        const origin = this.document.location.origin;

        // We assume the deployment structure is domain.com/lang/ or domain.com/base/lang/
        // We need to replace the current language segment in the URL with the new one.

        // A safe way is to split by the current locale if it exists in the path.
        // If we are currently in 'ru', the path likely contains '/ru/'.

        let newPath = currentPath;

        // Check if current locale is in the path
        const localeSegment = `/${this.locale}/`;
        const targetSegment = `/${targetLang}/`;

        if (currentPath.includes(localeSegment)) {
            newPath = currentPath.replace(localeSegment, targetSegment);
        } else {
            // If current locale is not in path (e.g. default served at root), 
            // we need to prepend the new locale.
            // Be careful with double slashes.
            if (currentPath === '/' || currentPath === '') {
                newPath = `/${targetLang}/`;
            } else {
                newPath = `/${targetLang}${currentPath}`;
            }
        }

        // Construct full URL
        // We use window.location.href to ensure we reload with the new app
        this.document.location.href = `${origin}${newPath}${this.document.location.search}`;
    }
}
