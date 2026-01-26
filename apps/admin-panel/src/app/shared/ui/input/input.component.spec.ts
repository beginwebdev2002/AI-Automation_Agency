import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;

    // Set required input 'label'
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when error input is set', () => {
    fixture.componentRef.setInput('error', 'Test Error');
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('p.text-red-600');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Test Error');
  });

  it('should not display error message when error input is null', () => {
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('p.text-red-600');
    expect(errorElement).toBeNull();
  });

  it('should have required attribute when required input is true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.required).toBe(true);
  });

  it('should apply error classes when error is present', () => {
    fixture.componentRef.setInput('error', 'Error');
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.classList.contains('border-red-600')).toBe(true);
  });
});
