import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-language-switcher',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './language-switcher.component.html',
    styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {
    languageService = inject(LanguageService);
}
