import { Controller, Get, Post, Body, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Post('venues')
    // @UseGuards(AuthGuard('jwt')) // Uncomment to protect
    createVenue(@Body() createVenueDto: CreateVenueDto) {
        return this.bookingService.createVenue(createVenueDto);
    }

    @Get('venues')
    findAllVenues(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        return this.bookingService.findAllVenues(page, limit);
    }

    @Post('appointments')
    // @UseGuards(AuthGuard('jwt'))
    createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.bookingService.createAppointment(createAppointmentDto);
    }

    @Get('appointments')
    findAllAppointments(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        return this.bookingService.findAllAppointments(page, limit);
    }
}
