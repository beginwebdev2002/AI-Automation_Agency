import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { Service, MOCK_SERVICES } from '@entities/appointment/model/appointment.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Telegram: any;

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss',
})
export class BookingListComponent {
  categories = [
    $localize`:@@categoryAll:Все`,
    $localize`:@@categoryLaser:Лазер`,
    $localize`:@@categoryBotox:Ботокс`,
    $localize`:@@categoryFacials:Уход за лицом`
  ];
  selectedCategory = signal<string>($localize`:@@categoryAll:Все`);
  services = signal<Service[]>(MOCK_SERVICES);
  cart = signal<Service[]>([]);

  filteredServices = computed(() => {
    const cat = this.selectedCategory();
    if (cat === $localize`:@@categoryAll:Все`) return this.services();
    return this.services().filter(s => s.category === cat); // Note: This assumes service categories match localized strings or need mapping
  });

  totalPrice = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.price, 0);
  });

  selectedIds = computed(() => new Set(this.cart().map(s => s.id)));

  constructor() {
    effect(() => {
      // Telegram WebApp Integration
      if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        if (this.cart().length > 0) {
          Telegram.WebApp.MainButton.setText(`ОПЛАТИТЬ ${this.totalPrice()} TJS`);
          Telegram.WebApp.MainButton.show();
          Telegram.WebApp.MainButton.onClick(() => this.confirmBooking());
        } else {
          Telegram.WebApp.MainButton.hide();
          Telegram.WebApp.MainButton.offClick(() => this.confirmBooking());
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
      console.log('Booking Confirmed:', data);
      alert(`Booking Confirmed! Total: ${this.totalPrice()} TJS`);
    }
  }
}
