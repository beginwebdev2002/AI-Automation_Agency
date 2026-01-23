import { Component, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { initFlowbite } from 'flowbite';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent implements AfterViewInit {
  languages = signal<Language[]>([
    { code: 'tj', name: 'Тоҷикӣ' },
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
  ]);
  selectedLanguage = signal<Language>(this.languages()[1]); // Default to Russian

  ngAfterViewInit(): void {
    initFlowbite();
  }

  selectLanguage(language: Language): void {
    this.selectedLanguage.set(language);
    // In a real application, you would also trigger the translation service here.
  }
}
