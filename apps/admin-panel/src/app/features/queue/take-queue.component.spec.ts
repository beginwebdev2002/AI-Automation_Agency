import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TakeQueueComponent } from './take-queue.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../core/config/config.service';
import { LanguageSwitcherComponent } from '../../core/components/language-switcher/language-switcher.component';
import { Component } from '@angular/core';
import { vi } from 'vitest';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: ''
})
class MockLanguageSwitcherComponent {}

describe('TakeQueueComponent', () => {
  let component: TakeQueueComponent;
  let fixture: ComponentFixture<TakeQueueComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeQueueComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ConfigService,
          useValue: { get: () => 'http://api' }
        }
      ]
    })
    .overrideComponent(TakeQueueComponent, {
      remove: { imports: [LanguageSwitcherComponent] },
      add: { imports: [MockLanguageSwitcherComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeQueueComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (httpMock) {
        httpMock.verify();
    }
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show inline error message on error', () => {
    vi.spyOn(window, 'alert');
    component.selectedCategory.set('Laser');
    component.joinQueue();

    const req = httpMock.expectOne('http://api/queue');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(window.alert).not.toHaveBeenCalled();
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector('[role="alert"]');
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.textContent).toContain('Не удалось встать в очередь');
  });
});
