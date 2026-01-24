import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../shared/tokens/app-config.token';

interface Ticket {
  sequenceNumber: number;
}

@Component({
  selector: 'app-take-queue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-queue.component.html',
  styleUrls: ['./take-queue.component.scss'],
})
export class TakeQueueComponent {
  categories = [
    { value: 'Laser', label: $localize`:@@categoryLaser:Лазер` },
    { value: 'Botox', label: $localize`:@@categoryBotox:Ботокс` },
    { value: 'Facials', label: $localize`:@@categoryFacials:Уход за лицом` },
    {
      value: 'Consultation',
      label: $localize`:@@categoryConsultation:Консультация`,
    },
  ];
  selectedCategory = signal<string>('');
  isLoading = signal(false);
  ticket = signal<Ticket | null>(null);
  errorMessage = signal<string>('');

  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  joinQueue() {
    if (!this.selectedCategory()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    const apiUrl = this.config.apiUrl + '/queue';
    this.http
      .post<Ticket>(apiUrl, { serviceCategory: this.selectedCategory() })
      .subscribe({
        next: (res) => {
          this.ticket.set(res);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set(
            $localize`:@@joinQueueError:Не удалось встать в очередь. Попробуйте снова.`,
          );
          this.isLoading.set(false);
        },
      });
  }
}
