import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '@shared/ui/card/card.component';
import { Service, MOCK_SERVICES } from '@entities/service/model/service.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss',
})
export class ServiceListComponent {
  services = signal<Service[]>(MOCK_SERVICES);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');

  categories = [
    { value: 'All', label: $localize`:@@categoryAll:Все` },
    { value: 'Laser', label: $localize`:@@categoryLaser:Лазер` },
    { value: 'Injectables', label: $localize`:@@categoryInjectables:Инъекции` },
    { value: 'Facials', label: $localize`:@@categoryFacials:Уход за лицом` },
  ];

  filteredServices = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.selectedCategory();

    return this.services().filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(query);
      const matchesCat = cat === 'All' || s.category === cat;
      return matchesSearch && matchesCat;
    });
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}
