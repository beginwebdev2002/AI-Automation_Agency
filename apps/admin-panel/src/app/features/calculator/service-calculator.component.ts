import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
    id: string;
    name: string;
    category: 'Laser' | 'Botox' | 'Facials';
    price: number;
}

@Component({
    selector: 'app-service-calculator',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6 bg-medical-rose-50 min-h-screen">
      <h2 class="text-3xl font-serif text-medical-rose-900 mb-6">Treatment Calculator</h2>

      <!-- Category Filter -->
      <div class="flex gap-3 mb-8 overflow-x-auto pb-2">
        <button *ngFor="let cat of categories"
                (click)="selectedCategory.set(cat)"
                [class.bg-medical-rose-500]="selectedCategory() === cat"
                [class.text-white]="selectedCategory() === cat"
                [class.bg-white]="selectedCategory() !== cat"
                [class.text-gray-600]="selectedCategory() !== cat"
                class="px-5 py-2 rounded-full shadow-sm transition-all whitespace-nowrap">
          {{ cat }}
        </button>
      </div>

      <!-- Services List -->
      <div class="grid gap-4 mb-24">
        <div *ngFor="let service of filteredServices()"
             (click)="toggleService(service)"
             [class.border-medical-gold-500]="isSelected(service)"
             class="bg-white p-5 rounded-2xl shadow-sm border-2 border-transparent cursor-pointer flex justify-between items-center transition-all">
          <div>
            <h3 class="font-medium text-gray-900">{{ service.name }}</h3>
            <p class="text-medical-rose-500 font-bold">{{ service.price }} TJS</p>
          </div>
          <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
               [class.border-medical-gold-500]="isSelected(service)"
               [class.bg-medical-gold-500]="isSelected(service)"
               [class.border-gray-300]="!isSelected(service)">
            <svg *ngIf="isSelected(service)" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Total Widget -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-3xl">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-500">Total Estimate</span>
          <span class="text-2xl font-bold text-medical-rose-900">{{ totalPrice() }} TJS</span>
        </div>
        <button class="w-full bg-medical-rose-900 text-white py-4 rounded-xl font-medium shadow-lg active:scale-95 transition-transform">
          Book Appointment
        </button>
      </div>
    </div>
  `
})
export class ServiceCalculatorComponent {
    categories = ['All', 'Laser', 'Botox', 'Facials'];
    selectedCategory = signal<string>('All');

    services = signal<Service[]>([
        { id: '1', name: 'Full Face Laser', category: 'Laser', price: 250 },
        { id: '2', name: 'Underarms Laser', category: 'Laser', price: 100 },
        { id: '3', name: 'Botox Forehead', category: 'Botox', price: 1200 },
        { id: '4', name: 'HydraFacial', category: 'Facials', price: 400 },
        { id: '5', name: 'Lip Filler', category: 'Facials', price: 1500 },
    ]);

    selectedServices = signal<Set<string>>(new Set());

    filteredServices = computed(() => {
        const cat = this.selectedCategory();
        if (cat === 'All') return this.services();
        return this.services().filter(s => s.category === cat);
    });

    totalPrice = computed(() => {
        const selectedIds = this.selectedServices();
        return this.services()
            .filter(s => selectedIds.has(s.id))
            .reduce((sum, s) => sum + s.price, 0);
    });

    toggleService(service: Service) {
        this.selectedServices.update(set => {
            const newSet = new Set(set);
            if (newSet.has(service.id)) {
                newSet.delete(service.id);
            } else {
                newSet.add(service.id);
            }
            return newSet;
        });
    }

    isSelected(service: Service): boolean {
        return this.selectedServices().has(service.id);
    }
}
