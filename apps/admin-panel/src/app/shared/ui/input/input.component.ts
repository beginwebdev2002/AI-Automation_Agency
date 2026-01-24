import { Component, input, forwardRef, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  label = input.required<string>();
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = input<string>(' ');
  id = input<string>(`input-${Math.random().toString(36).substr(2, 9)}`);
  error = input<string | null>(null);
  required = input<boolean>(false);

  errorId = computed(() => `${this.id()}-error`);

  inputClasses = computed(() => {
    const base = 'block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer transition-colors duration-300';
    const normal = 'text-surface-900 border-surface-300 focus:border-primary-600';
    const errorState = 'text-red-900 border-red-600 focus:border-red-600 dark:text-red-400 dark:border-red-500';

    return `${base} ${this.error() ? errorState : normal}`;
  });

  labelClasses = computed(() => {
     const base = 'peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6';
     const normal = 'text-surface-500 peer-focus:text-primary-600';
     const errorState = 'text-red-600 peer-focus:text-red-600 dark:text-red-400 dark:peer-focus:text-red-400';

     return `${base} ${this.error() ? errorState : normal}`;
  });

  value = '';
  disabled = false;

  onChange: (value: string) => void = () => { /* empty */ };
  onTouched: () => void = () => { /* empty */ };

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
