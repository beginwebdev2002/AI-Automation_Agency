import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingListComponent } from './booking-list.component';
import { By } from '@angular/platform-browser';

describe('BookingListComponent', () => {
  let component: BookingListComponent;
  let fixture: ComponentFixture<BookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have accessible category filter', () => {
    const radioGroup = fixture.debugElement.query(By.css('[role="radiogroup"]'));
    expect(radioGroup).withContext('Category container should have role="radiogroup"').toBeTruthy();
    expect(radioGroup.attributes['aria-label']).withContext('Category container should have aria-label').toBe('Service Categories');

    const radios = fixture.debugElement.queryAll(By.css('[role="radio"]'));
    expect(radios.length).withContext('Should find radio buttons').toBeGreaterThan(0);

    // Check first radio (default selected)
    expect(radios[0].attributes['aria-checked']).withContext('First radio should be checked').toBe('true');
    // Check second radio
    expect(radios[1].attributes['aria-checked']).withContext('Second radio should be unchecked').toBe('false');
  });

  it('should have accessible service items with aria-pressed', () => {
    // Service items are divs with role="button"
    const serviceButtons = fixture.debugElement.queryAll(By.css('div[role="button"]'));
    expect(serviceButtons.length).toBeGreaterThan(0);

    const firstButton = serviceButtons[0];

    // Should have aria-pressed attribute
    expect(firstButton.attributes['aria-pressed']).withContext('Service item should have aria-pressed').toBe('false');

    // Click to select
    firstButton.nativeElement.click();
    fixture.detectChanges();

    expect(firstButton.attributes['aria-pressed']).withContext('Service item should be pressed after click').toBe('true');
  });
});
