import { Inject, Injectable } from '@nestjs/common';
import { Booking, ServiceItem } from '@domain/booking/booking.entity';
import { IBookingRepository } from '@domain/booking/booking.repository.interface';

export const BOOKING_REPOSITORY = 'BOOKING_REPOSITORY';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(
    clientId: string,
    clientName: string,
    date: Date,
    items: ServiceItem[],
  ): Promise<Booking> {
    // Business Logic: Validate date availability (could be another service)

    const booking = new Booking(
      crypto.randomUUID(), // In real app, ID gen might be infrastructure
      clientId,
      clientName,
      date,
      items,
    );

    await this.bookingRepository.save(booking);

    // Future: Send Notification via NotificationService Port

    return booking;
  }
}
