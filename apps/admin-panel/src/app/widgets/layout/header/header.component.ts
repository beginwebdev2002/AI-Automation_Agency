import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from '@shared/ui/language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {}
