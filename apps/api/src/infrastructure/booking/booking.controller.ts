import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateBookingUseCase } from '@application/booking/create-booking.usecase';
import { GetBookingsUseCase } from '@application/booking/get-bookings.usecase';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly getBookingsUseCase: GetBookingsUseCase,
  ) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.createBookingUseCase.execute(
      createBookingDto.clientId,
      createBookingDto.clientName,
      new Date(createBookingDto.date),
      createBookingDto.items,
    );
  }

  @Get()
  async findAll() {
    return this.getBookingsUseCase.execute();
  }
}
