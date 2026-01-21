import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { Queue, QueueSchema } from './schemas/queue.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Queue.name, schema: QueueSchema }]),
        ConfigModule
    ],
    controllers: [QueueController],
    providers: [QueueService],
})
export class QueueModule { }
