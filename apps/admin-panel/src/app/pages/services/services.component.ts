import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from '@features/services/service-list/service-list.component';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, ServiceListComponent, ButtonComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {}
