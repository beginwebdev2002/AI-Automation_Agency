import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

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
    fixture.componentRef.setInput('label', 'Test Button');
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('button'),
    ).nativeElement;
    expect(buttonElement.textContent.trim()).toBe('Test Button');
  });

  it('should apply variant classes', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('button'),
    ).nativeElement;
    expect(buttonElement.className).toContain('bg-surface-900');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('button'),
    ).nativeElement;
    expect(buttonElement.disabled).toBe(true);
    expect(buttonElement.className).toContain('cursor-not-allowed');
  });

  it('should show loading spinner and be disabled when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('label', 'Saving');
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(
      By.css('button'),
    ).nativeElement;
    const spinner = fixture.debugElement.query(By.css('svg'));

    // Verify button is disabled
    expect(buttonElement.disabled).toBe(true);

    // Verify spinner is present
    expect(spinner).toBeTruthy();
    expect(spinner.nativeElement.classList.contains('animate-spin')).toBe(true);

    // Verify accessibility
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
  });
});
