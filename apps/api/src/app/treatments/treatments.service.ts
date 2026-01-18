import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Treatment, TreatmentDocument } from './schemas/treatment.schema';

@Injectable()
export class TreatmentsService {
    constructor(
        @InjectModel(Treatment.name) private treatmentModel: Model<TreatmentDocument>
    ) { }

    async findAll(): Promise<Treatment[]> {
        return this.treatmentModel.find().exec();
    }

    async create(createTreatmentDto: any): Promise<Treatment> {
        const createdTreatment = new this.treatmentModel(createTreatmentDto);
        return createdTreatment.save();
    }

    getFaq(): any[] {
        return [
            {
                question: 'Does diode laser hurt?',
                answer: 'Most patients describe the sensation as a light snap of a rubber band. It is generally well-tolerated.',
            },
            {
                question: 'How should I prep for my appointment?',
                answer: 'Shave the area 24 hours before. Avoid sun exposure for 2 weeks prior.',
            },
        ];
    }

    async seed() {
        const count = await this.treatmentModel.countDocuments();
        if (count === 0) {
            const treatments = [
                { name: 'Full Face Laser', category: 'Laser', price: 250, description: 'Complete face hair removal' },
                { name: 'Underarms Laser', category: 'Laser', price: 100, description: 'Underarm hair removal' },
                { name: 'Botox Forehead', category: 'Botox', price: 1200, description: 'Smooth out forehead lines' },
                { name: 'HydraFacial', category: 'Facials', price: 400, description: 'Deep cleansing and hydration' },
            ];
            await this.treatmentModel.insertMany(treatments);
        }
    }
}
