import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '@shared/ui/input/input.component';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);

  buttonLabel = computed(() => {
    return this.isLoading()
      ? $localize`:@@loginButtonLoading:Вход...`
      : $localize`:@@loginButton:Войти`;
  });

  get emailError(): string | null {
    const control = this.form.get('email');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return $localize`:@@emailRequired:Email обязателен`;
      if (control.errors['email']) return $localize`:@@emailInvalid:Некорректный email`;
    }
    return null;
  }

  get passwordError(): string | null {
    const control = this.form.get('password');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return $localize`:@@passwordRequired:Пароль обязателен`;
      if (control.errors['minlength']) return $localize`:@@passwordMinLength:Минимум 6 символов`;
    }
    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
