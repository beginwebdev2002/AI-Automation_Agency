import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label when provided', () => {
    fixture.componentRef.setInput('label', 'Test Button');
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('Test Button');
  });

  it('should apply correct variant classes', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.classList.contains('bg-surface-900')).toBe(true);
  });

  it('should show loading spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('svg.animate-spin');
    expect(spinner).toBeTruthy();

    // Should verify aria-busy
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
  });

  it('should be disabled when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBe(true);
  });

  it('should not show spinner when loading is false', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('svg.animate-spin');
    expect(spinner).toBeFalsy();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-busy')).toBe('false');
  });
});
