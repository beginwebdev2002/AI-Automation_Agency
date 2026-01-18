import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Post('venues')
    // @UseGuards(AuthGuard('jwt')) // Uncomment to protect
    createVenue(@Body() createVenueDto: any) {
        return this.bookingService.createVenue(createVenueDto);
    }

    @Get('venues')
    findAllVenues() {
        return this.bookingService.findAllVenues();
    }

    @Post('appointments')
    // @UseGuards(AuthGuard('jwt'))
    createAppointment(@Body() createAppointmentDto: any) {
        return this.bookingService.createAppointment(createAppointmentDto);
    }

    @Get('appointments')
    findAllAppointments() {
        return this.bookingService.findAllAppointments();
    }
}
