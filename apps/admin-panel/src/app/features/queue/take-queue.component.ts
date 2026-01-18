import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../core/config/config.service';
import { LanguageSwitcherComponent } from '../../core/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-take-queue',
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent],
  template: `
    <div class="min-h-screen bg-medical-rose-50 flex flex-col items-center justify-center p-6">
      <div class="absolute top-4 right-4">
        <app-language-switcher></app-language-switcher>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center">
        <h2 class="text-2xl font-serif text-medical-rose-900 mb-2" i18n="@@welcomeTitle">Welcome to AAA Cosmetics</h2>
        <p class="text-gray-500 mb-8" i18n="@@selectServicePrompt">Please select a service to join the queue</p>

        <div class="space-y-3 mb-8">
          <button *ngFor="let cat of categories"
                  (click)="selectedCategory.set(cat.value)"
                  [class.ring-2]="selectedCategory() === cat.value"
                  [class.ring-medical-rose-500]="selectedCategory() === cat.value"
                  class="w-full p-4 rounded-xl bg-gray-50 hover:bg-medical-rose-50 transition-all text-left flex justify-between items-center group">
            <span class="font-medium text-gray-700 group-hover:text-medical-rose-700">{{ cat.label }}</span>
            <div [class.bg-medical-rose-500]="selectedCategory() === cat.value"
                 [class.border-gray-300]="selectedCategory() !== cat.value"
                 class="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                 <div *ngIf="selectedCategory() === cat.value" class="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </button>
        </div>

        <button (click)="joinQueue()"
                [disabled]="!selectedCategory() || isLoading()"
                class="w-full bg-medical-rose-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all">
          <span *ngIf="!isLoading()" i18n="@@takeNumberButton">TAKE A NUMBER</span>
          <span *ngIf="isLoading()" i18n="@@processingButton">Processing...</span>
        </button>

        <div *ngIf="ticket()" class="mt-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 animate-fade-in">
          <p class="text-sm" i18n="@@inQueueMessage">You are in queue!</p>
          <p class="text-3xl font-bold mt-1">#{{ ticket()?.sequenceNumber }}</p>
        </div>
      </div>
    </div>
  `
})
export class TakeQueueComponent {
  categories = [
    { value: 'Laser', label: $localize`:@@categoryLaser:Laser` },
    { value: 'Botox', label: $localize`:@@categoryBotox:Botox` },
    { value: 'Facials', label: $localize`:@@categoryFacials:Facials` },
    { value: 'Consultation', label: $localize`:@@categoryConsultation:Consultation` }
  ];
  selectedCategory = signal<string>('');
  isLoading = signal(false);
  ticket = signal<any>(null);

  constructor(private http: HttpClient, private configService: ConfigService) { }

  joinQueue() {
    if (!this.selectedCategory()) return;

    this.isLoading.set(true);
    const apiUrl = this.configService.get('BACKEND_URL_ONLINE') + '/queue';
    this.http.post(apiUrl, { serviceCategory: this.selectedCategory() }).subscribe({
      next: (res) => {
        this.ticket.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        alert($localize`:@@joinQueueError:Failed to join queue. Please try again.`);
        this.isLoading.set(false);
      }
    });
  }
}
