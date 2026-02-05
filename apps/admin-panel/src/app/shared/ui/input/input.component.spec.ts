import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { Component } from '@angular/core';

@Component({
  template: `
    <app-input
      [label]="label"
      [error]="error"
      [required]="required"
    ></app-input>
  `,
  standalone: true,
  imports: [InputComponent],
})
class TestHostComponent {
  label = 'Test Label';
  error: string | null = null;
  required = false;
}

describe('InputComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when error input is set', () => {
    component.error = 'Test Error';
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('p.text-red-600');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Test Error');
  });

  it('should not display error message when error input is null', () => {
    component.error = null;
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('p.text-red-600');
    expect(errorElement).toBeNull();
  });

  it('should have required attribute when required input is true', () => {
    component.required = true;
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.required).toBe(true);
  });

  it('should apply error classes when error is present', () => {
    component.error = 'Error';
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.classList.contains('border-red-600')).toBe(true);
  });
});
