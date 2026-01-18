import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venue, VenueDocument } from './schemas/venue.schema';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';

@Injectable()
export class BookingService {
    constructor(
        @InjectModel(Venue.name) private venueModel: Model<VenueDocument>,
        @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>
    ) { }

    async createVenue(createVenueDto: any): Promise<Venue> {
        const createdVenue = new this.venueModel(createVenueDto);
        return createdVenue.save();
    }

    async findAllVenues(): Promise<Venue[]> {
        return this.venueModel.find().exec();
    }

    async createAppointment(createAppointmentDto: any): Promise<Appointment> {
        const createdAppointment = new this.appointmentModel(createAppointmentDto);
        return createdAppointment.save();
    }

    async findAllAppointments(): Promise<Appointment[]> {
        return this.appointmentModel.find().populate('user').populate('venue').exec();
    }
}
