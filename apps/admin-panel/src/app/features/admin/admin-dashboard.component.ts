import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../core/config/config.service';
import { LanguageSwitcherComponent } from '../../core/components/language-switcher/language-switcher.component';

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
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800" i18n="@@adminDashboardTitle">Панель администратора</h1>
      </div>

      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm">
          <h3 class="text-gray-500 text-sm font-medium uppercase" i18n="@@totalClientsLabel">Всего клиентов</h3>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats().totalClients }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm">
          <h3 class="text-gray-500 text-sm font-medium uppercase" i18n="@@telegramRevenueLabel">Выручка Telegram</h3>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ stats().revenue }} <span i18n="@@currencyTJS">TJS</span></p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm">
          <h3 class="text-gray-500 text-sm font-medium uppercase" i18n="@@activeQueueLabel">Активная очередь</h3>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ queue().length }}</p>
        </div>
      </div>

      <!-- Queue Management -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-800" i18n="@@queueManagementTitle">Управление очередью</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th class="px-6 py-4" i18n="@@columnHash">#</th>
                <th class="px-6 py-4" i18n="@@columnName">Имя</th>
                <th class="px-6 py-4" i18n="@@columnService">Услуга</th>
                <th class="px-6 py-4" i18n="@@columnStatus">Статус</th>
                <th class="px-6 py-4" i18n="@@columnActions">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (item of queue(); track item._id) {
                <tr>
                  <td class="px-6 py-4 font-bold text-gray-900">{{ item.sequenceNumber }}</td>
                  <td class="px-6 py-4">{{ item.firstName }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{{ item.serviceCategory }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span [class.bg-yellow-100]="item.status === 'waiting'"
                          [class.text-yellow-800]="item.status === 'waiting'"
                          [class.bg-blue-100]="item.status === 'in-progress'"
                          [class.text-blue-800]="item.status === 'in-progress'"
                          class="px-2 py-1 rounded-full text-xs font-bold uppercase">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 flex gap-2">
                    @if (item.status === 'waiting') {
                      <button 
                              (click)="updateStatus(item._id, 'in-progress')"
                              class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                              i18n="@@actionCall">
                        Вызвать
                      </button>
                    }
                    @if (item.status === 'in-progress') {
                      <button 
                              (click)="updateStatus(item._id, 'completed')"
                              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                              i18n="@@actionComplete">
                        Завершить
                      </button>
                    }
                    <button (click)="updateStatus(item._id, 'cancelled')"
                            class="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                            i18n="@@actionCancel">
                      Отменить
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
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
    const apiUrl = this.configService.get('BACKEND_URL_ONLINE') + '/queue';
    this.http.get<QueueItem[]>(apiUrl).subscribe(data => this.queue.set(data));
  }

  updateStatus(id: string, status: string) {
    const apiUrl = this.configService.get('BACKEND_URL_ONLINE') + `/queue/${id}/status`;
    this.http.patch(apiUrl, { status }).subscribe(() => {
      this.fetchQueue();
    });
  }
}
