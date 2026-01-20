import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceCalculatorComponent } from './service-calculator.component';
import { FormsModule } from '@angular/forms';

describe('ServiceCalculatorComponent', () => {
  let component: ServiceCalculatorComponent;
  let fixture: ComponentFixture<ServiceCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCalculatorComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter services by search query', () => {
    // Initial state: all services shown (depending on default category 'All')
    const initialCount = component.filteredServices().length;
    expect(initialCount).toBeGreaterThan(0);

    // Set search query
    component.searchQuery.set('Лазер');
    fixture.detectChanges();

    const filteredCount = component.filteredServices().length;
    expect(filteredCount).toBeLessThan(initialCount);

    // Check if filtered services contain the query
    const allMatch = component.filteredServices().every(s => s.name.toLowerCase().includes('лазер'));
    expect(allMatch).toBe(true);
  });

  it('should combine category and search filters', () => {
    // Select category 'Injectables'
    component.selectedCategory.set('Injectables');

    // Set search query
    component.searchQuery.set('Ботокс');
    fixture.detectChanges();

    const filtered = component.filteredServices();

    // Should match both category and name
    const allMatch = filtered.every(s =>
      s.category === 'Injectables' && s.name.includes('Ботокс')
    );
    expect(allMatch).toBe(true);
    expect(filtered.length).toBeGreaterThan(0);
  });
});
