import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button (click)="setLanguage('ru')" [class.active]="currentLang() === 'ru'">RU</button>
      <button (click)="setLanguage('en')" [class.active]="currentLang() === 'en'">EN</button>
      <button (click)="setLanguage('tj')" [class.active]="currentLang() === 'tj'">TJ</button>
    </div>
  `,
  styles: [`
    .language-switcher { display: flex; gap: 8px; }
    button { 
      padding: 4px 8px; 
      cursor: pointer; 
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
    }
    .active { 
      font-weight: bold; 
      background-color: #007bff; 
      color: white;
      border-color: #007bff;
    }
  `]
})
export class LanguageSwitcherComponent {
  private languageService = inject(LanguageService);
  currentLang = this.languageService.currentLanguage;

  setLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
