import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueDashboardComponent } from './queue-dashboard.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { APP_CONFIG } from '../../shared/tokens/app-config.token';
import { vi } from 'vitest';

interface QueueItem {
  _id: string;
  status: string;
}

describe('QueueDashboardComponent', () => {
  let component: QueueDashboardComponent;
  let fixture: ComponentFixture<QueueDashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueDashboardComponent, HttpClientTestingModule],
      providers: [
        {
          provide: APP_CONFIG,
          useValue: { apiUrl: 'http://api' }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QueueDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://api/queue');
    req.flush([]);
    expect(component).toBeTruthy();
  });

  it('should poll every 5 seconds', () => {
    fixture.detectChanges();

    // Initial request
    let req = httpMock.expectOne('http://api/queue');
    req.flush([]);

    // Advance 5 seconds
    vi.advanceTimersByTime(5000);

    // Should be a second request
    req = httpMock.expectOne('http://api/queue');
    req.flush([]);
  });

  it('should NOT update signal if data is same (optimization)', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://api/queue');
    const initialData: QueueItem[] = [{ _id: '1', status: 'waiting' }];
    req.flush(initialData);

    const setSpy = vi.spyOn(component.queue, 'set');

    // Advance time to trigger poll
    vi.advanceTimersByTime(5000);

    const req2 = httpMock.expectOne('http://api/queue');
    req2.flush([{ _id: '1', status: 'waiting' }]); // Same data content

    // Optimization check: set() should NOT be called
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('should update signal if data changed', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://api/queue');
    const initialData: QueueItem[] = [{ _id: '1', status: 'waiting' }];
    req.flush(initialData);

    const setSpy = vi.spyOn(component.queue, 'set');

    // Advance time to trigger poll
    vi.advanceTimersByTime(5000);

    const req2 = httpMock.expectOne('http://api/queue');
    req2.flush([{ _id: '1', status: 'in-progress' }]); // Changed data

    expect(setSpy).toHaveBeenCalled();
  });

  it('should clear interval on destroy', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    fixture.detectChanges();
    const req = httpMock.expectOne('http://api/queue');
    req.flush([]);

    fixture.destroy();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
