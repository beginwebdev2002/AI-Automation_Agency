import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VenueDocument = HydratedDocument<Venue>;

@Schema({ timestamps: true })
export class Venue {
    @Prop({ required: true })
    name!: string;

    @Prop()
    address!: string;

    @Prop({ type: [String], default: [] })
    images!: string[];

    @Prop({ required: true })
    capacity!: number;
}

export const VenueSchema = SchemaFactory.createForClass(Venue);
