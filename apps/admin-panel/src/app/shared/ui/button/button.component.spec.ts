import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { LucideAngularModule } from 'lucide-angular';
import { ComponentRef } from '@angular/core';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let componentRef: ComponentRef<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, LucideAngularModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    componentRef.setInput('label', 'Click me');
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent.trim()).toBe('Click me');
  });

  it('should be disabled when disabled input is true', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBe(true);
  });

  it('should show spinner and be disabled when loading is true', () => {
    componentRef.setInput('loading', true);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    const spinner = fixture.nativeElement.querySelector('.animate-spin');

    expect(buttonElement.disabled).toBe(true);
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
    expect(spinner).toBeTruthy();
  });
});
