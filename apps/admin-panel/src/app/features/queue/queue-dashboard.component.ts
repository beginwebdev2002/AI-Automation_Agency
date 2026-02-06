import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  OnInit,
  OnDestroy,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { APP_CONFIG } from '../../shared/tokens/app-config.token';

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
  styleUrls: ['./queue-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueDashboardComponent implements OnInit, OnDestroy {
  queue = signal<QueueItem[]>([]);

  current = computed(() =>
    this.queue().find((i) => i.status === 'in-progress'),
  );
  waiting = computed(() => this.queue().filter((i) => i.status === 'waiting'));

  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.fetchQueue();
    this.intervalId = setInterval(() => this.fetchQueue(), 5000); // Poll every 5s
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  fetchQueue() {
    const apiUrl = this.config.apiUrl + '/queue';
    this.http.get<QueueItem[]>(apiUrl).subscribe((data) => {
      // Optimization: Only update signal if data actually changed to prevent unnecessary re-renders
      if (JSON.stringify(data) !== JSON.stringify(this.queue())) {
        this.queue.set(data);
      }
    });
  }
}
