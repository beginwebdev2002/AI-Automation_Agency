import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingListComponent } from '@features/booking/booking-list/booking-list.component';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, BookingListComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {}
