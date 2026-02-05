import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems = signal([
    {
      label: $localize`:@@menuDashboard:Дашборд`,
      icon: 'layout-grid',
      route: '/dashboard',
    },
    {
      label: $localize`:@@menuBooking:Запись`,
      icon: 'calendar-check',
      route: '/booking',
    },
    {
      label: $localize`:@@menuInventory:Инвентарь`,
      icon: 'shirt',
      route: '/inventory',
    },
    {
      label: $localize`:@@menuServices:Услуги`,
      icon: 'sparkles',
      route: '/services',
    },
    {
      label: $localize`:@@menuSettings:Настройки`,
      icon: 'settings',
      route: '/settings',
    },
  ]);
}
