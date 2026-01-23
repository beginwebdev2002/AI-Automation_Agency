import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingComponent } from './booking.component';

// Assuming vi is global because of vitest/globals
import { vi } from 'vitest';

interface MockMainButton {
  setText: ReturnType<typeof vi.fn>;
  show: ReturnType<typeof vi.fn>;
  hide: ReturnType<typeof vi.fn>;
  onClick: ReturnType<typeof vi.fn>;
  offClick: ReturnType<typeof vi.fn>;
  isVisible: boolean;
}

describe('BookingComponent Performance', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let mockMainButton: MockMainButton;

  beforeEach(async () => {
    mockMainButton = {
      setText: vi.fn(),
      show: vi.fn(),
      hide: vi.fn(),
      onClick: vi.fn(),
      offClick: vi.fn(),
      isVisible: false
    };

    (window as unknown as { Telegram: unknown }).Telegram = {
      WebApp: {
        MainButton: mockMainButton,
        sendData: vi.fn()
      }
    };

    await TestBed.configureTestingModule({
      imports: [BookingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    (window as unknown as { Telegram: unknown }).Telegram = undefined;
  });

  it('demonstrates event listener leak', async () => {
    // Initial state: cart is empty.
    // Optimization: Listener is attached once on init.
    expect(mockMainButton.onClick).toHaveBeenCalledTimes(1);

    // Add item 1
    component.toggleService({ id: '1', name: 'S1', category: 'Лазер', price: 100 });
    fixture.detectChanges();
    await fixture.whenStable();

    // Effect runs. onClick should NOT be called again.
    expect(mockMainButton.onClick).toHaveBeenCalledTimes(1);

    // Add item 2
    component.toggleService({ id: '2', name: 'S2', category: 'Лазер', price: 200 });
    fixture.detectChanges();
    await fixture.whenStable();

    // Remove item 1
    component.toggleService({ id: '1', name: 'S1', category: 'Лазер', price: 100 });
    fixture.detectChanges();
    await fixture.whenStable();

    // With the fix, onClick is called only once in ngOnInit
    console.log('onClick calls:', mockMainButton.onClick.mock.calls.length);

    // We expect exactly 1 call now
    expect(mockMainButton.onClick).toHaveBeenCalledTimes(1);
  });
});
