import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venue, VenueDocument } from './schemas/venue.schema';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateVenueDto } from './dto/create-venue.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Venue.name) private venueModel: Model<VenueDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async createVenue(createVenueDto: CreateVenueDto): Promise<Venue> {
    const createdVenue = new this.venueModel(createVenueDto);
    return createdVenue.save();
  }

  async findAllVenues(page = 1, limit = 10): Promise<Venue[]> {
    const MAX_LIMIT = 100;
    if (limit > MAX_LIMIT) {
      limit = MAX_LIMIT;
    }
    const skip = (page - 1) * limit;
    return this.venueModel.find().skip(skip).limit(limit).exec();
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return createdAppointment.save();
  }

  async findAllAppointments(page = 1, limit = 10): Promise<Appointment[]> {
    const MAX_LIMIT = 100;
    if (limit > MAX_LIMIT) {
      limit = MAX_LIMIT;
    }
    const skip = (page - 1) * limit;
    return this.appointmentModel
      .find()
      .populate('user', 'email role')
      .populate('venue', 'name address')
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
