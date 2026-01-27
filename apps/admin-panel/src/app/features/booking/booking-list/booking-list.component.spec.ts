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

  it('should have aria-pressed attribute on category buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    // The first few buttons are categories.
    // Based on template: @for (cat of categories...)

    // Check the first category button (All/Все)
    const allButton = buttons[0];
    expect(allButton.nativeElement.getAttribute('aria-pressed')).toBe('true');

    // Check the second category button
    const laserButton = buttons[1];
    expect(laserButton.nativeElement.getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('should toggle aria-pressed on category buttons when clicked', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const laserButton = buttons[1];

    laserButton.nativeElement.click();
    fixture.detectChanges();

    expect(laserButton.nativeElement.getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].nativeElement.getAttribute('aria-pressed')).toBe('false');
  });

  it('should have aria-pressed attribute on service items', () => {
    // Service items have role="button"
    const serviceItems = fixture.debugElement.queryAll(
      By.css('[role="button"]'),
    );
    const firstService = serviceItems[0];

    // Initially not selected
    expect(firstService.nativeElement.getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('should toggle aria-pressed on service items when clicked', () => {
    const serviceItems = fixture.debugElement.queryAll(
      By.css('[role="button"]'),
    );
    const firstService = serviceItems[0];

    firstService.nativeElement.click();
    fixture.detectChanges();

    expect(firstService.nativeElement.getAttribute('aria-pressed')).toBe(
      'true',
    );

    firstService.nativeElement.click();
    fixture.detectChanges();

    expect(firstService.nativeElement.getAttribute('aria-pressed')).toBe(
      'false',
    );
  });
});
