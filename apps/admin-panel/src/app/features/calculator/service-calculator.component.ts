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
  templateUrl: './service-calculator.component.html',
  styleUrls: ['./service-calculator.component.scss']
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
