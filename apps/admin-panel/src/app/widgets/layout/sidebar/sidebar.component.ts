import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems = signal([
    {
      label: $localize`:@@menuDashboard:Дашборд`,
      icon: 'fas fa-chart-line',
      route: '/dashboard',
    },
    {
      label: $localize`:@@menuBooking:Запись`,
      icon: 'fas fa-calendar-check',
      route: '/booking',
    },
    {
      label: $localize`:@@menuInventory:Инвентарь`,
      icon: 'fas fa-tshirt',
      route: '/inventory',
    },
    {
      label: $localize`:@@menuServices:Услуги`,
      icon: 'fas fa-spa',
      route: '/services',
    },
    {
      label: $localize`:@@menuSettings:Настройки`,
      icon: 'fas fa-cog',
      route: '/settings',
    },
  ]);
}
