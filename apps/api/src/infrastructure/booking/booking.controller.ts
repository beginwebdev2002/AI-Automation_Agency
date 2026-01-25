import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateBookingUseCase } from '@application/booking/create-booking.usecase';
import { GetBookingsUseCase } from '@application/booking/get-bookings.usecase';
import { CreateBookingDto } from './create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly getBookingsUseCase: GetBookingsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateBookingDto) {
    return this.createBookingUseCase.execute(
      dto.clientId,
      dto.clientName,
      new Date(dto.date),
      dto.items,
    );
  }

  @Get()
  async findAll() {
    return this.getBookingsUseCase.execute();
  }
}
