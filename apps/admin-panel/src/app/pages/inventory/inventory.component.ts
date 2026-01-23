import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DressListComponent } from '@features/inventory/dress-list/dress-list.component';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [CommonModule, DressListComponent, ButtonComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {}
