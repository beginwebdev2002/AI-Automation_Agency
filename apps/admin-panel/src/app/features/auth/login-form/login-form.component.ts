import { Component, inject, signal, computed } from '@angular/core';
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

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
  }
}
