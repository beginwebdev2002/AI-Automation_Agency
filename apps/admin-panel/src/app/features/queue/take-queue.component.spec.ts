import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TakeQueueComponent } from './take-queue.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { APP_CONFIG } from '../../shared/tokens/app-config.token';
import { LanguageSwitcherComponent } from '@shared/ui/language-switcher/language-switcher.component';
import { Component } from '@angular/core';
import { vi } from 'vitest';

describe('TakeQueueComponent', () => {
  let component: TakeQueueComponent;
  let fixture: ComponentFixture<TakeQueueComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeQueueComponent, HttpClientTestingModule],
      providers: [
        {
          provide: APP_CONFIG,
          useValue: { apiUrl: 'http://api' }
        }
      ]
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
