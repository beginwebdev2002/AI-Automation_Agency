import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { APP_CONFIG } from '../../shared/tokens/app-config.token';

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
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  stats = signal({ totalClients: 124, revenue: 15400 }); // Mock stats
  queue = signal<QueueItem[]>([]);

  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  ngOnInit() {
    this.fetchQueue();
  }

  fetchQueue() {
    const apiUrl = this.config.apiUrl + '/queue';
    this.http
      .get<QueueItem[]>(apiUrl)
      .subscribe((data) => this.queue.set(data));
  }

  updateStatus(id: string, status: string) {
    const apiUrl = this.config.apiUrl + `/queue/${id}/status`;
    this.http.patch(apiUrl, { status }).subscribe(() => {
      this.fetchQueue();
    });
  }
}
