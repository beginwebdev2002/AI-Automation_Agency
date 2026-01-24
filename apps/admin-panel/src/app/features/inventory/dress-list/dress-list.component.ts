import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/ui/card/card.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { Dress, MOCK_DRESSES } from '@entities/dress/model/dress.model';

@Component({
  selector: 'app-dress-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  templateUrl: './dress-list.component.html',
  styleUrl: './dress-list.component.scss',
})
export class DressListComponent {
  dresses = signal<Dress[]>(MOCK_DRESSES);

  getStatusColor(status: Dress['status']): string {
    switch (status) {
      case 'available':
        return 'bg-success/10 text-success border-success/20';
      case 'rented':
        return 'bg-primary-500/10 text-primary-600 border-primary-500/20';
      case 'cleaning':
        return 'bg-surface-500/10 text-surface-600 border-surface-500/20';
    }
  }

  getStatusLabel(status: Dress['status']): string {
    switch (status) {
      case 'available':
        return $localize`:@@statusAvailable:Доступно`;
      case 'rented':
        return $localize`:@@statusRented:В аренде`;
      case 'cleaning':
        return $localize`:@@statusCleaning:Химчистка`;
    }
  }
}
