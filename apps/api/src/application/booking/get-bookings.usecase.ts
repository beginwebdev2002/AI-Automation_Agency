import { Inject, Injectable } from '@nestjs/common';
import { Booking } from '@domain/booking/booking.entity';
import { IBookingRepository } from '@domain/booking/booking.repository.interface';
import { BOOKING_REPOSITORY } from './create-booking.usecase';

@Injectable()
export class GetBookingsUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }
}
