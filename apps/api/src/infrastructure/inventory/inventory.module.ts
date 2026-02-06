import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryController } from './inventory.controller';
import { DressModel, DressSchema } from './dress.schema';
import { InventoryRepository } from './inventory.repository';
import {
  AddDressUseCase,
  INVENTORY_REPOSITORY,
} from '@application/inventory/add-dress.usecase';
import { AdminGuard } from '../auth/guards/admin.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DressModel.name, schema: DressSchema }]),
  ],
  controllers: [InventoryController],
  providers: [
    AddDressUseCase,
    AdminGuard,
    {
      provide: INVENTORY_REPOSITORY,
      useClass: InventoryRepository,
    },
  ],
  exports: [AddDressUseCase],
})
export class InventoryModule {}
