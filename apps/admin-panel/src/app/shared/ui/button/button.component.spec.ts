import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';
import { LucideAngularModule, Loader2 } from 'lucide-angular';
import { vi } from 'vitest';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, LucideAngularModule.pick({ Loader2 })],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label', () => {
    fixture.componentRef.setInput('label', 'Test Button');
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.textContent.trim()).toBe('Test Button');
  });

  it('should apply variant classes', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('bg-surface-900');
  });

  it('should show loading spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('lucide-icon'));
    expect(spinner).toBeTruthy();
    expect(spinner.nativeElement.classList).toContain('animate-spin');

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
    expect(buttonElement.disabled).toBe(true);
  });

  it('should not show loading spinner when loading is false', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('lucide-icon'));
    expect(spinner).toBeFalsy();

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.getAttribute('aria-busy')).toBe('false');
  });

  it('should emit clicked event when clicked', () => {
      const emitSpy = vi.spyOn(component.clicked, 'emit');
      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click', null);
      expect(emitSpy).toHaveBeenCalled();
  });
});
