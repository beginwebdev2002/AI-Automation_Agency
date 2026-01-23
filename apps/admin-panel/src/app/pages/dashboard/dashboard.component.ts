import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from '@widgets/stats/stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
