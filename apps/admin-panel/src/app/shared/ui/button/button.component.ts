import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  label = input<string>('');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fullWidth = input<boolean>(false);

  clicked = output<void>();

  get classes(): string {
    const base =
      'font-sans font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-4 focus:outline-none transition-all duration-300 uppercase tracking-wider inline-flex items-center justify-center';
    const width = this.fullWidth() ? 'w-full flex' : 'inline-flex';
    const disabled =
      this.disabled() || this.loading()
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'text-white bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 hover:bg-gradient-to-br focus:ring-primary-300 shadow-md shadow-primary-500/50',
      secondary:
        'text-white bg-surface-900 hover:bg-surface-800 focus:ring-surface-300 shadow-md shadow-surface-900/50',
      outline:
        'text-primary-600 bg-transparent border border-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-300',
      ghost:
        'text-surface-700 bg-transparent hover:bg-surface-100 focus:ring-surface-200',
    };

    return `${base} ${width} ${disabled} ${variants[this.variant()]}`;
  }
}
