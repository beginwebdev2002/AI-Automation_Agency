import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TreatmentDocument = Treatment & Document;

@Schema()
export class Treatment {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    category: string; // 'Laser', 'Botox', 'Facials'

    @Prop({ required: true })
    price: number; // In TJS

    @Prop()
    description: string;
}

export const TreatmentSchema = SchemaFactory.createForClass(Treatment);
