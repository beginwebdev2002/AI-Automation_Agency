import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
    template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <h1 class="text-4xl font-serif text-center text-medical-rose-900 mb-10">Live Queue</h1>

      <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <!-- Currently Serving -->
        <div class="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-medical-gold-500">
          <h2 class="text-2xl font-medium text-gray-500 mb-6">Now Serving</h2>
          <div *ngIf="current()" class="text-center">
            <div class="text-9xl font-bold text-medical-rose-600 mb-4">{{ current()?.sequenceNumber }}</div>
            <div class="text-2xl text-gray-800">{{ current()?.firstName }}</div>
            <div class="text-lg text-medical-gold-600 uppercase tracking-wider mt-2">{{ current()?.serviceCategory }}</div>
          </div>
          <div *ngIf="!current()" class="text-center text-gray-400 py-10">
            Waiting for next patient...
          </div>
        </div>

        <!-- Waiting List -->
        <div class="bg-white p-8 rounded-3xl shadow-sm">
          <h2 class="text-2xl font-medium text-gray-500 mb-6">Up Next</h2>
          <div class="space-y-4">
            <div *ngFor="let item of waiting()" class="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-4">
                <span class="text-2xl font-bold text-gray-400">#{{ item.sequenceNumber }}</span>
                <span class="font-medium text-gray-700">{{ item.firstName }}</span>
              </div>
              <span class="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-500 shadow-sm">
                {{ item.serviceCategory }}
              </span>
            </div>
            <div *ngIf="waiting().length === 0" class="text-center text-gray-400 py-4">
              Queue is empty
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QueueDashboardComponent implements OnInit {
    queue = signal<QueueItem[]>([]);

    current = computed(() => this.queue().find(i => i.status === 'in-progress'));
    waiting = computed(() => this.queue().filter(i => i.status === 'waiting'));

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.fetchQueue();
        setInterval(() => this.fetchQueue(), 5000); // Poll every 5s
    }

    fetchQueue() {
        this.http.get<QueueItem[]>('/api/queue').subscribe(data => {
            this.queue.set(data);
        });
    }
}

// Helper for computed
import { computed } from '@angular/core';
