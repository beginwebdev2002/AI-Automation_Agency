import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/config/config.service';
import { LanguageSwitcherComponent } from '@core/components/language-switcher/language-switcher.component';

interface QueueItem {
  _id: string;
  sequenceNumber: number;
  firstName: string;
  serviceCategory: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = signal({ totalClients: 124, revenue: 15400 }); // Mock stats
  queue = signal<QueueItem[]>([]);

  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  ngOnInit() {
    this.fetchQueue();
  }

  fetchQueue() {
    const apiUrl = (this.configService.get('BACKEND_URL_ONLINE') as string) + '/queue';
    this.http.get<QueueItem[]>(apiUrl).subscribe(data => this.queue.set(data));
  }

  updateStatus(id: string, status: string) {
    const apiUrl = (this.configService.get('BACKEND_URL_ONLINE') as string) + `/queue/${id}/status`;
    this.http.patch(apiUrl, { status }).subscribe(() => {
      this.fetchQueue();
    });
  }
}
