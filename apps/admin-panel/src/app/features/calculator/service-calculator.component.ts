import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
  id: string;
  name: string;
  category: 'Laser' | 'Injectables' | 'Facials';
  price: number;
}

@Component({
  selector: 'app-service-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 bg-medical-rose-50 min-h-screen">

      <!-- Search Input -->
      <div class="mb-6 relative">
        <input
          type="text"
          [ngModel]="searchQuery()"
          (ngModelChange)="searchQuery.set($event)"
          placeholder="Search services..."
          i18n-placeholder="@@searchServicesPlaceholder"
          class="w-full px-4 py-3 pl-12 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-medical-rose-500 text-gray-700"
        />
        <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Category Filter -->
      <div class="flex gap-3 mb-8 overflow-x-auto pb-2">
        @for (cat of categories; track cat.value) {
          <button 
                  (click)="selectedCategory.set(cat.value)"
                  [class.bg-medical-rose-500]="selectedCategory() === cat.value"
                  [class.text-white]="selectedCategory() === cat.value"
                  [class.bg-white]="selectedCategory() !== cat.value"
                  [class.text-gray-600]="selectedCategory() !== cat.value"
                  class="px-5 py-2 rounded-full shadow-sm transition-all whitespace-nowrap">
            {{ cat.label }}
          </button>
        }
      </div>

      <!-- Services List -->
      <div class="grid gap-4 mb-24">
        @for (service of filteredServices(); track service.id) {
          <div 
               (click)="toggleService(service)"
               (keydown.enter)="toggleService(service)"
               tabindex="0"
               role="button"
               [attr.aria-pressed]="isSelected(service)"
               [class.border-medical-gold-500]="isSelected(service)"
               class="bg-white p-5 rounded-2xl shadow-sm border-2 border-transparent cursor-pointer flex justify-between items-center transition-all">
            <div>
              <h3 class="font-medium text-gray-900">{{ service.name }}</h3>
              <p class="text-medical-rose-500 font-bold">{{ service.price }} <span i18n="@@currencyTJS">TJS</span></p>
            </div>
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                 [class.border-medical-gold-500]="isSelected(service)"
                 [class.bg-medical-gold-500]="isSelected(service)"
                 [class.border-gray-300]="!isSelected(service)">
              @if (isSelected(service)) {
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              }
            </div>
          </div>
        }
        @if (filteredServices().length === 0) {
          <div class="text-center py-10 text-gray-500">
            <p i18n="@@noServicesFound">No services found</p>
          </div>
        }
      </div>

      <!-- Total Widget -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-3xl">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-500" i18n="@@totalEstimateLabel">Итого</span>
          <span class="text-2xl font-bold text-medical-rose-900">{{ totalPrice() }} <span i18n="@@currencyTJS">TJS</span></span>
        </div>
        <button class="w-full bg-medical-rose-900 text-white py-4 rounded-xl font-medium shadow-lg active:scale-95 transition-transform" i18n="@@bookAppointmentButton">
          Записаться
        </button>
      </div>
    </div>
  `
})
export class ServiceCalculatorComponent {
  categories = [
    { value: 'All', label: $localize`:@@categoryAll:Все` },
    { value: 'Laser', label: $localize`:@@categoryLaser:Лазер` },
    { value: 'Injectables', label: $localize`:@@categoryInjectables:Инъекции` },
    { value: 'Facials', label: $localize`:@@categoryFacials:Уход за лицом` }
  ];
  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');

  services = signal<Service[]>([
    // Laser (Women)
    { id: 'l_w_1', name: $localize`:@@serviceLaserUpperLip:Лазер: Верхняя губа`, category: 'Laser', price: 40 },
    { id: 'l_w_2', name: $localize`:@@serviceLaserChin:Лазер: Подбородок`, category: 'Laser', price: 40 },
    { id: 'l_w_3', name: $localize`:@@serviceLaserSideburns:Лазер: Бакенбарды`, category: 'Laser', price: 40 },
    { id: 'l_w_4', name: $localize`:@@serviceLaserGlabella:Лазер: Межбровье`, category: 'Laser', price: 90 },
    { id: 'l_w_5', name: $localize`:@@serviceLaserForehead:Лазер: Лоб`, category: 'Laser', price: 60 },
    { id: 'l_w_6', name: $localize`:@@serviceLaserFullFace:Лазер: Лицо полностью`, category: 'Laser', price: 140 },
    { id: 'l_w_7', name: $localize`:@@serviceLaserUnderarms:Лазер: Подмышки`, category: 'Laser', price: 90 },
    { id: 'l_w_8', name: $localize`:@@serviceLaserArmsHalf:Лазер: Руки до локтя`, category: 'Laser', price: 100 },
    { id: 'l_w_9', name: $localize`:@@serviceLaserArmsFull:Лазер: Руки полностью`, category: 'Laser', price: 180 },
    { id: 'l_w_10', name: $localize`:@@serviceLaserStomachLine:Лазер: Живот (дорожка)`, category: 'Laser', price: 40 },
    { id: 'l_w_11', name: $localize`:@@serviceLaserBikiniClassic:Лазер: Бикини классика`, category: 'Laser', price: 140 },
    { id: 'l_w_12', name: $localize`:@@serviceLaserBikiniDeep:Лазер: Бикини глубокое`, category: 'Laser', price: 200 },
    { id: 'l_w_13', name: $localize`:@@serviceLaserLegsHalf:Лазер: Голени`, category: 'Laser', price: 150 },
    { id: 'l_w_14', name: $localize`:@@serviceLaserLegsFull:Лазер: Ноги полностью`, category: 'Laser', price: 250 },
    { id: 'l_w_15', name: $localize`:@@serviceLaserFullBody:Лазер: Все тело (Бикини+Подм+Ноги)`, category: 'Laser', price: 500 },

    // Laser (Men)
    { id: 'l_m_1', name: $localize`:@@serviceLaserMenBeard:Лазер [М]: Окантовка бороды`, category: 'Laser', price: 80 },
    { id: 'l_m_2', name: $localize`:@@serviceLaserMenNeck:Лазер [М]: Шея`, category: 'Laser', price: 90 },
    { id: 'l_m_3', name: $localize`:@@serviceLaserMenUnderarms:Лазер [М]: Подмышки`, category: 'Laser', price: 120 },
    { id: 'l_m_4', name: $localize`:@@serviceLaserMenChest:Лазер [М]: Грудь`, category: 'Laser', price: 250 },
    { id: 'l_m_5', name: $localize`:@@serviceLaserMenBack:Лазер [М]: Спина полностью`, category: 'Laser', price: 350 },
    { id: 'l_m_6', name: $localize`:@@serviceLaserMenStomach:Лазер [М]: Живот`, category: 'Laser', price: 200 },

    // Injectables (Botox)
    { id: 'i_b_1', name: $localize`:@@serviceBotoxForehead:Ботокс: Лоб (горизонт)`, category: 'Injectables', price: 600 },
    { id: 'i_b_2', name: $localize`:@@serviceBotoxGlabella:Ботокс: Межбровье`, category: 'Injectables', price: 400 },
    { id: 'i_b_3', name: $localize`:@@serviceBotoxCrowsFeet:Ботокс: Гусиные лапки`, category: 'Injectables', price: 500 },
    { id: 'i_b_4', name: $localize`:@@serviceBotoxHyperhidrosis:Ботокс: Лечение гипергидроза`, category: 'Injectables', price: 1800 },

    // Injectables (Fillers)
    { id: 'i_f_1', name: $localize`:@@serviceFillerLipsStart:Увеличение губ (Start)`, category: 'Injectables', price: 1200 },
    { id: 'i_f_2', name: $localize`:@@serviceFillerLipsPremium:Увеличение губ (Premium)`, category: 'Injectables', price: 2200 },
    { id: 'i_f_3', name: $localize`:@@serviceFillerCheekbones:Скулы / Подбородок`, category: 'Injectables', price: 1400 },
    { id: 'i_f_4', name: $localize`:@@serviceFillerNasolabial:Носогубные складки`, category: 'Injectables', price: 1300 },

    // Injectables (Biorevitalization)
    { id: 'i_bio_1', name: $localize`:@@serviceBioFaceBasic:Биоревитализация: Лицо (Basic)`, category: 'Injectables', price: 1200 },
    { id: 'i_bio_2', name: $localize`:@@serviceBioFacePremium:Биоревитализация: Лицо (Premium)`, category: 'Injectables', price: 2500 },
    { id: 'i_bio_3', name: $localize`:@@servicePlasmolifting:Плазмолифтинг (PRP)`, category: 'Injectables', price: 250 },

    // Facials
    { id: 'f_1', name: $localize`:@@serviceFacialCleansing:Чистка лица "12 этапов"`, category: 'Facials', price: 150 },
    { id: 'f_2', name: $localize`:@@servicePeelingPRX:Пилинг PRX-T33`, category: 'Facials', price: 450 },
    { id: 'f_3', name: $localize`:@@serviceCarboxy:Карбокситерапия`, category: 'Facials', price: 200 },
    { id: 'f_4', name: $localize`:@@serviceMassage:Массаж лица`, category: 'Facials', price: 100 },
    { id: 'f_5', name: $localize`:@@serviceAlginateMask:Альгинатная маска`, category: 'Facials', price: 50 },
  ]);

  selectedServices = signal<Set<string>>(new Set());

  filteredServices = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase();

    let filtered = this.services();

    if (cat !== 'All') {
      filtered = filtered.filter(s => s.category === cat);
    }

    if (query) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(query));
    }

    return filtered;
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
