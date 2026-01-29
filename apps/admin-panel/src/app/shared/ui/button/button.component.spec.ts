import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { vi } from 'vitest';

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

  it('should render label', () => {
    fixture.componentRef.setInput('label', 'Click me');
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('Click me');
  });

  it('should show spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('svg.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('should be disabled when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBe(true);
  });

  it('should have aria-busy attribute when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
  });

  it('should emit clicked event when clicked', () => {
    const spy = vi.spyOn(component.clicked, 'emit');
    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit clicked event when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const spy = vi.spyOn(component.clicked, 'emit');
    const buttonElement = fixture.nativeElement.querySelector('button');

    // In strict environments, disabled elements might not trigger click,
    // but if they do, the component shouldn't emit.
    // However, the component relies on native button behavior.
    // If the browser prevents the click, the handler won't run.
    // If we simulate the click event manually on the element:
    buttonElement.click();

    // Since the native button is disabled, the click event might not be dispatched by the browser.
    // But testing libraries sometimes bypass this.
    // If the event IS dispatched, we want to ensure we don't handle it?
    // Actually, Angular doesn't prevent default on disabled buttons manually if the browser does.
    // Let's rely on native behavior which we are testing by checking the disabled attribute above.
    // But we can check if the spy was called.
    expect(spy).not.toHaveBeenCalled();
  });
});
