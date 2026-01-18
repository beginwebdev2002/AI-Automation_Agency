import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-take-queue',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-medical-rose-50 flex flex-col items-center justify-center p-6">
      <div class="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center">
        <h2 class="text-2xl font-serif text-medical-rose-900 mb-2">Welcome to AAA Cosmetics</h2>
        <p class="text-gray-500 mb-8">Please select a service to join the queue</p>

        <div class="space-y-3 mb-8">
          <button *ngFor="let cat of categories"
                  (click)="selectedCategory.set(cat)"
                  [class.ring-2]="selectedCategory() === cat"
                  [class.ring-medical-rose-500]="selectedCategory() === cat"
                  class="w-full p-4 rounded-xl bg-gray-50 hover:bg-medical-rose-50 transition-all text-left flex justify-between items-center group">
            <span class="font-medium text-gray-700 group-hover:text-medical-rose-700">{{ cat }}</span>
            <div [class.bg-medical-rose-500]="selectedCategory() === cat"
                 [class.border-gray-300]="selectedCategory() !== cat"
                 class="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                 <div *ngIf="selectedCategory() === cat" class="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </button>
        </div>

        <button (click)="joinQueue()"
                [disabled]="!selectedCategory() || isLoading()"
                class="w-full bg-medical-rose-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all">
          <span *ngIf="!isLoading()">TAKE A NUMBER</span>
          <span *ngIf="isLoading()">Processing...</span>
        </button>

        <div *ngIf="ticket()" class="mt-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 animate-fade-in">
          <p class="text-sm">You are in queue!</p>
          <p class="text-3xl font-bold mt-1">#{{ ticket()?.sequenceNumber }}</p>
        </div>
      </div>
    </div>
  `
})
export class TakeQueueComponent {
    categories = ['Laser', 'Botox', 'Facials', 'Consultation'];
    selectedCategory = signal<string>('');
    isLoading = signal(false);
    ticket = signal<any>(null);

    constructor(private http: HttpClient) { }

    joinQueue() {
        if (!this.selectedCategory()) return;

        this.isLoading.set(true);
        this.http.post('/api/queue', { serviceCategory: this.selectedCategory() }).subscribe({
            next: (res) => {
                this.ticket.set(res);
                this.isLoading.set(false);
            },
            error: () => {
                alert('Failed to join queue. Please try again.');
                this.isLoading.set(false);
            }
        });
    }
}
