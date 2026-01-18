import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Queue, QueueDocument } from './schemas/queue.schema';

@Injectable()
export class QueueService {
    constructor(
        @InjectModel(Queue.name) private queueModel: Model<QueueDocument>
    ) { }

    async addToQueue(userId: number, firstName: string, username: string, serviceCategory: string): Promise<Queue> {
        // Find today's max sequence number
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const lastEntry = await this.queueModel
            .findOne({ createdAt: { $gte: startOfDay } })
            .sort({ sequenceNumber: -1 })
            .exec();

        const sequenceNumber = lastEntry ? lastEntry.sequenceNumber + 1 : 1;

        const newEntry = new this.queueModel({
            userId,
            firstName,
            username,
            serviceCategory,
            sequenceNumber,
            status: 'waiting',
        });

        return newEntry.save();
    }

    async getQueue(): Promise<Queue[]> {
        return this.queueModel.find({ status: { $in: ['waiting', 'in-progress'] } }).sort({ sequenceNumber: 1 }).exec();
    }

    async updateStatus(id: string, status: 'in-progress' | 'completed' | 'cancelled'): Promise<Queue> {
        return this.queueModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
}
