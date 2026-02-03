import { Component, Input, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { provideRouter } from '@angular/router';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-button',
  standalone: true,
  template: ''
})
class MockButtonComponent {
    @Input() loading?: boolean;
    @Input() fullWidth?: boolean;
    @Input() label?: string | null;
    @Input() disabled?: boolean;
}

@Component({
  selector: 'app-input',
  standalone: true,
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockInputComponent),
      multi: true
    }
  ]
})
class MockInputComponent implements ControlValueAccessor {
    @Input() label!: string;
    @Input() type?: string;
    @Input() placeholder?: string;
    @Input() error?: string | null;
    @Input() required?: boolean;

    writeValue(obj: unknown): void {}
    registerOnChange(fn: (val: unknown) => void): void {}
    registerOnTouched(fn: () => void): void {}
    setDisabledState?(isDisabled: boolean): void {}
}

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [provideRouter([])]
    })
    .overrideComponent(LoginFormComponent, {
      remove: { imports: [ButtonComponent, InputComponent] },
      add: { imports: [MockButtonComponent, MockInputComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
