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
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.textContent).toContain('Test Button');
  });

  it('should show spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('svg.animate-spin'));
    expect(spinner).toBeTruthy();
  });

  it('should be disabled when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.disabled).toBe(true);
  });

  it('should have aria-busy attribute when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.getAttribute('aria-busy')).toBe('true');
  });

  it('should not show spinner when loading is false', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('svg.animate-spin'));
    expect(spinner).toBeFalsy();
  });
});
