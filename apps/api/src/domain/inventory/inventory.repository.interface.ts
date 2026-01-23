import { Dress, DressCategory, DressStatus } from './dress.entity';

export interface IInventoryRepository {
  save(dress: Dress): Promise<void>;
  findById(id: string): Promise<Dress | null>;
  findAll(): Promise<Dress[]>;
  findByCategory(category: DressCategory): Promise<Dress[]>;
  findByStatus(status: DressStatus): Promise<Dress[]>;
}
