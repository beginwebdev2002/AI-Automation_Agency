import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateBookingUseCase } from '@application/booking/create-booking.usecase';
import { GetBookingsUseCase } from '@application/booking/get-bookings.usecase';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly getBookingsUseCase: GetBookingsUseCase,
  ) {}

  @Post()
  async create(@Body() body: any) {
    // In real app, use DTO validation here
    return this.createBookingUseCase.execute(
      body.clientId,
      body.clientName,
      new Date(body.date),
      body.items,
    );
  }

  @Get()
  async findAll() {
    return this.getBookingsUseCase.execute();
  }
}
