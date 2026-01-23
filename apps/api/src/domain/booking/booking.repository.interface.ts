import { Booking } from './booking.entity';

export interface IBookingRepository {
  save(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  findByDateRange(start: Date, end: Date): Promise<Booking[]>;
}
