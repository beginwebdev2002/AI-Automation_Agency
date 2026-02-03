import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DressDocument = HydratedDocument<DressModel>;

@Schema({ collection: 'dresses', timestamps: true })
export class DressModel {
  @Prop({ required: true })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, enum: ['Wedding', 'Evening', 'Traditional'] })
  category!: string;

  @Prop({ required: true })
  size!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({
    required: true,
    enum: ['available', 'rented', 'cleaning', 'maintenance'],
  })
  status!: string;

  @Prop({ required: true })
  imageUrl!: string;
}

export const DressSchema = SchemaFactory.createForClass(DressModel);
DressSchema.index({ category: 1 });
DressSchema.index({ status: 1 });
