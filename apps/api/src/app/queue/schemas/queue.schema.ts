import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QueueDocument = Queue & Document;

@Schema({ timestamps: true })
export class Queue {
  @Prop({ required: true })
  userId!: number;

  @Prop({ required: true })
  firstName!: string;

  @Prop()
  username!: string;

  @Prop({ required: true })
  serviceCategory!: string; // 'Laser', 'Botox', etc.

  @Prop({ required: true })
  sequenceNumber!: number;

  @Prop({ default: 'waiting' })
  status!: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
}

export const QueueSchema = SchemaFactory.createForClass(Queue);

QueueSchema.index({ createdAt: 1, sequenceNumber: -1 });
// Optimize getQueue: Compound index for filtering by status and sorting by sequence
QueueSchema.index({ status: 1, sequenceNumber: 1 });
