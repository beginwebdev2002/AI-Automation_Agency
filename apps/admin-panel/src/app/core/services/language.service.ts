import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly currentLanguage = signal<string>('ru');

  getLanguage(): string {
    return this.currentLanguage();
  }

  setLanguage(lang: string) {
    this.currentLanguage.set(lang);
  }
}
