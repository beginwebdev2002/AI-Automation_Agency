import { Inject, Injectable } from '@nestjs/common';
import { Dress, DressCategory } from '@domain/inventory/dress.entity';
import { IInventoryRepository } from '@domain/inventory/inventory.repository.interface';

export const INVENTORY_REPOSITORY = 'INVENTORY_REPOSITORY';

@Injectable()
export class AddDressUseCase {
  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(
    name: string,
    category: DressCategory,
    size: string,
    price: number,
    imageUrl: string,
  ): Promise<Dress> {
    const dress = new Dress(
      crypto.randomUUID(),
      name,
      category,
      size,
      price,
      'available',
      imageUrl,
    );

    await this.inventoryRepository.save(dress);
    return dress;
  }
}
