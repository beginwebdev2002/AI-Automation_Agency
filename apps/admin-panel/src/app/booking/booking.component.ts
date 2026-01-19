import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const Telegram: any;

interface Service {
  id: string;
  name: string;
  category: 'Лазер' | 'Ботокс' | 'Уход за лицом';
  price: number;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 bg-gray-50 min-h-screen pb-24">
      <h1 class="text-2xl font-bold text-rose-700 mb-4" i18n>Выберите услуги</h1>

      <!-- Category Filter -->
      <div class="flex gap-2 overflow-x-auto mb-6 pb-2">
        @for (cat of categories; track cat) {
          <button 
            (click)="selectedCategory.set(cat)"
            [class.bg-rose-600]="selectedCategory() === cat"
            [class.text-white]="selectedCategory() === cat"
            [class.bg-white]="selectedCategory() !== cat"
            [class.text-gray-700]="selectedCategory() !== cat"
            class="px-4 py-2 rounded-full shadow-sm whitespace-nowrap transition-colors"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Service List -->
      <div class="space-y-3">
        @for (service of filteredServices(); track service.id) {
          <div 
               (click)="toggleService(service)"
               [class.border-rose-500]="isSelected(service)"
               class="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent transition-all cursor-pointer flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-gray-800">{{ service.name }}</h3>
              <p class="text-rose-600 font-medium">{{ service.price }} TJS</p>
            </div>
            @if (isSelected(service)) {
              <div class="text-rose-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
            }
          </div>
        }
      </div>

      <!-- Floating Action Button -->
      @if (cart().length > 0) {
        <div class="fixed bottom-4 left-4 right-4">
          <button (click)="confirmBooking()" 
                  class="w-full bg-rose-600 text-white py-4 rounded-xl font-bold shadow-lg flex justify-between px-6 items-center">
            <span i18n>Подтвердить запись</span>
            <span>{{ totalPrice() }} TJS</span>
          </button>
        </div>
      }
    </div>
  `
})
export class BookingComponent {
  categories = ['Все', 'Лазер', 'Ботокс', 'Уход за лицом'];
  selectedCategory = signal<string>('Все');

  services = signal<Service[]>([
    { id: '1', name: 'Лазер всего лица', category: 'Лазер', price: 250 },
    { id: '2', name: 'Лазер подмышек', category: 'Лазер', price: 100 },
    { id: '3', name: 'Ботокс лба', category: 'Ботокс', price: 1200 },
    { id: '4', name: 'Чистка HydraFacial', category: 'Уход за лицом', price: 400 },
  ]);

  cart = signal<Service[]>([]);

  filteredServices = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'Все') return this.services();
    return this.services().filter(s => s.category === cat);
  });

  totalPrice = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.price, 0);
  });

  constructor() {
    effect(() => {
      if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        if (this.cart().length > 0) {
          Telegram.WebApp.MainButton.setText($localize`ОПЛАТИТЬ ${this.totalPrice()} TJS`);
          Telegram.WebApp.MainButton.show();
          Telegram.WebApp.MainButton.onClick(this.confirmBooking.bind(this));
        } else {
          Telegram.WebApp.MainButton.hide();
        }
      }
    });
  }

  toggleService(service: Service) {
    this.cart.update(items => {
      const exists = items.find(i => i.id === service.id);
      if (exists) {
        return items.filter(i => i.id !== service.id);
      }
      return [...items, service];
    });
  }

  isSelected(service: Service) {
    return this.cart().some(i => i.id === service.id);
  }

  confirmBooking() {
    const data = {
      items: this.cart(),
      total: this.totalPrice()
    };

    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
      Telegram.WebApp.sendData(JSON.stringify(data));
    } else {
      console.log('Sending data to bot:', data);
      alert('Data sent! (Check console)');
    }
  }
}
