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

  it('should display label', () => {
    fixture.componentRef.setInput('label', 'Test Button');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Test Button');
  });

  it('should show loading spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('lucide-icon'));
    expect(spinner).toBeTruthy();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('should be disabled when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBe(true);
  });

  it('should set aria-label', () => {
    fixture.componentRef.setInput('ariaLabel', 'Custom Label');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.getAttribute('aria-label')).toBe('Custom Label');
  });
});
