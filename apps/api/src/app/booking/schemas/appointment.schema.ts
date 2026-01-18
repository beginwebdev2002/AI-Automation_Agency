import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Venue } from './venue.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Appointment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: Types.ObjectId, ref: 'Venue', required: true })
    venue: Venue;

    @Prop({ required: true })
    startTime: Date;

    @Prop({ required: true })
    endTime: Date;

    @Prop({ required: true, enum: AppointmentStatus, default: AppointmentStatus.PENDING })
    status: AppointmentStatus;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
