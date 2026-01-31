import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBookingRepository } from '@domain/booking/booking.repository.interface';
import { Booking, BookingStatus } from '@domain/booking/booking.entity';
import { BookingModel, BookingDocument } from './booking.schema';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(
    @InjectModel(BookingModel.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async save(booking: Booking): Promise<void> {
    const exists = await this.bookingModel.exists({ _id: booking.id });
    if (exists) {
      await this.bookingModel.updateOne({ _id: booking.id }, booking);
    } else {
      await this.bookingModel.create({
        _id: booking.id,
        ...booking,
      });
    }
  }

  async findById(id: string): Promise<Booking | null> {
    const doc = await this.bookingModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(): Promise<Booking[]> {
    const docs = await this.bookingModel.find().exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByDateRange(start: Date, end: Date): Promise<Booking[]> {
    const docs = await this.bookingModel
      .find({
        date: { $gte: start, $lte: end },
      })
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  private toEntity(doc: BookingDocument): Booking {
    return new Booking(
      doc._id,
      doc.clientId,
      doc.clientName,
      doc.date,
      doc.items,
      doc.status as BookingStatus,
      doc.createdAt || new Date(),
    );
  }
}
