import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { ConfigService } from '../../core/config/config.service';

interface QueueItem {
  _id: string;
  firstName: string;
  serviceCategory: string;
  sequenceNumber: number;
  status: 'waiting' | 'in-progress' | 'completed';
}

@Component({
  selector: 'app-queue-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './queue-dashboard.component.html',
  styleUrls: ['./queue-dashboard.component.scss']
})
export class QueueDashboardComponent implements OnInit {
  queue = signal<QueueItem[]>([]);

  current = computed(() => this.queue().find(i => i.status === 'in-progress'));
  waiting = computed(() => this.queue().filter(i => i.status === 'waiting'));

  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  ngOnInit() {
    this.fetchQueue();
    setInterval(() => this.fetchQueue(), 5000); // Poll every 5s
  }

  fetchQueue() {
    const apiUrl = this.configService.get('BACKEND_URL_ONLINE') + '/queue';
    this.http.get<QueueItem[]>(apiUrl).subscribe(data => {
      this.queue.set(data);
    });
  }
}


