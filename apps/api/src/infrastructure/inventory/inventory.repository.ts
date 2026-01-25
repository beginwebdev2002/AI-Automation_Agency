import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IInventoryRepository } from '@domain/inventory/inventory.repository.interface';
import {
  Dress,
  DressCategory,
  DressStatus,
} from '@domain/inventory/dress.entity';
import { DressModel, DressDocument } from './dress.schema';

@Injectable()
export class InventoryRepository implements IInventoryRepository {
  constructor(
    @InjectModel(DressModel.name)
    private readonly dressModel: Model<DressDocument>,
  ) {}

  async save(dress: Dress): Promise<void> {
    const exists = await this.dressModel.exists({ _id: dress.id });
    if (exists) {
      await this.dressModel.updateOne({ _id: dress.id }, dress);
    } else {
      await this.dressModel.create({
        _id: dress.id,
        ...dress,
      });
    }
  }

  async findById(id: string): Promise<Dress | null> {
    const doc = await this.dressModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(): Promise<Dress[]> {
    const docs = await this.dressModel.find().exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByCategory(category: DressCategory): Promise<Dress[]> {
    const docs = await this.dressModel.find({ category }).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByStatus(status: DressStatus): Promise<Dress[]> {
    const docs = await this.dressModel.find({ status }).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  private toEntity(doc: DressDocument): Dress {
    return new Dress(
      doc._id,
      doc.name,
      doc.category as DressCategory,
      doc.size,
      doc.price,
      doc.status as DressStatus,
      doc.imageUrl,
      doc.createdAt ?? new Date(),
    );
  }
}
