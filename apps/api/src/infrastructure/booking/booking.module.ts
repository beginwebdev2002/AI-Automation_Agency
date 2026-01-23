import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './booking.controller';
import { BookingModel, BookingSchema } from './booking.schema';
import { BookingRepository } from './booking.repository';
import { CreateBookingUseCase, BOOKING_REPOSITORY } from '@application/booking/create-booking.usecase';
import { GetBookingsUseCase } from '@application/booking/get-bookings.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BookingModel.name, schema: BookingSchema }])
  ],
  controllers: [BookingController],
  providers: [
    CreateBookingUseCase,
    GetBookingsUseCase,
    {
      provide: BOOKING_REPOSITORY,
      useClass: BookingRepository
    }
  ],
  exports: [CreateBookingUseCase]
})
export class BookingModule {}
