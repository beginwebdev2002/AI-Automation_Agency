import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/ui/card/card.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [CommonModule, CardComponent, LucideAngularModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {
  stats = signal([
    {
      label: $localize`:@@statsBookingsToday:Записей сегодня`,
      value: '12',
      icon: 'calendar-check',
      color: 'text-primary-500',
    },
    {
      label: $localize`:@@statsRevenue:Выручка (TJS)`,
      value: '4,500',
      icon: 'wallet',
      color: 'text-success',
    },
    {
      label: $localize`:@@statsNewClients:Новых клиентов`,
      value: '5',
      icon: 'user-plus',
      color: 'text-primary-400',
    },
    {
      label: $localize`:@@statsRentedDresses:Платьев в аренде`,
      value: '8',
      icon: 'shirt',
      color: 'text-rose-500',
    },
  ]);
}
