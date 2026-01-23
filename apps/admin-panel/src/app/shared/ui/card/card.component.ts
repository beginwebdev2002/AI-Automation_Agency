import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  title = input<string | undefined>(undefined);
  glass = input<boolean>(false);
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');

  get classes(): string {
    const base = 'rounded-xl border transition-all duration-300';
    const style = this.glass() 
      ? 'bg-white/80 backdrop-blur-md border-white/20 shadow-xl' 
      : 'bg-white border-primary-100 shadow-lg shadow-primary-500/5 hover:shadow-primary-500/10';
    
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    return `${base} ${style} ${paddings[this.padding()]}`;
  }
}
