import { Component, signal, computed, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, OnDestroy {
  categories = ['Все', 'Лазер', 'Ботокс', 'Уход за лицом'];
  selectedCategory = signal<string>('Все');

  services = signal<Service[]>([
    { id: '1', name: 'Лазер всего лица', category: 'Лазер', price: 250 },
    { id: '2', name: 'Лазер подмышек', category: 'Лазер', price: 100 },
    { id: '3', name: 'Ботокс лба', category: 'Ботокс', price: 1200 },
    { id: '4', name: 'Чистка HydraFacial', category: 'Уход за лицом', price: 400 },
  ]);

  cart = signal<Service[]>([]);

  selectedIds = computed(() => new Set(this.cart().map(s => s.id)));

  filteredServices = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'Все') return this.services();
    return this.services().filter(s => s.category === cat);
  });

  totalPrice = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.price, 0);
  });

  private readonly confirmBookingCallback = this.confirmBooking.bind(this);

  constructor() {
    effect(() => {
      if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        if (this.cart().length > 0) {
          Telegram.WebApp.MainButton.setText($localize`ОПЛАТИТЬ ${this.totalPrice()} TJS`);
          Telegram.WebApp.MainButton.show();
        } else {
          Telegram.WebApp.MainButton.hide();
        }
      }
    });
  }

  ngOnInit() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
      Telegram.WebApp.MainButton.onClick(this.confirmBookingCallback);
    }
  }

  ngOnDestroy() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
      Telegram.WebApp.MainButton.offClick(this.confirmBookingCallback);
      Telegram.WebApp.MainButton.hide();
    }
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
    return this.selectedIds().has(service.id);
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
