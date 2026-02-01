import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookingDocument = HydratedDocument<BookingModel>;

@Schema({ collection: 'bookings', timestamps: true })
export class BookingModel {
  @Prop({ required: true })
  _id!: string;

  @Prop({ required: true })
  clientId!: string;

  @Prop({ required: true })
  clientName!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ type: Array, required: true })
  items!: {
    serviceId: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[];

  @Prop({
    required: true,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
  })
  status!: string;
}

export const BookingSchema = SchemaFactory.createForClass(BookingModel);

// Optimize findByDateRange queries which are critical for calendar views
BookingSchema.index({ date: 1 });
