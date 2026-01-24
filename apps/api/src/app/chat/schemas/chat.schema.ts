import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Message {
  @Prop({ required: true, enum: ['user', 'model'] })
  role!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ default: Date.now })
  timestamp!: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true, unique: true })
  chatId!: string; // Telegram Chat ID or User ID

  @Prop({ type: [MessageSchema], default: [] })
  history!: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
