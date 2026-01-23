export type DressStatus = 'available' | 'rented' | 'cleaning' | 'maintenance';
export type DressCategory = 'Wedding' | 'Evening' | 'Traditional';

export class Dress {
  constructor(
    public readonly id: string,
    public name: string,
    public category: DressCategory,
    public size: string,
    public price: number,
    public status: DressStatus = 'available',
    public imageUrl: string,
    public readonly createdAt: Date = new Date()
  ) {}

  rent(): void {
    if (this.status !== 'available') {
      throw new Error(`Dress is not available for rent. Current status: ${this.status}`);
    }
    this.status = 'rented';
  }

  returnFromRent(): void {
    if (this.status !== 'rented') {
      throw new Error('Dress is not currently rented');
    }
    this.status = 'cleaning';
  }

  finishCleaning(): void {
    if (this.status !== 'cleaning') {
      throw new Error('Dress is not in cleaning');
    }
    this.status = 'available';
  }

  markForMaintenance(): void {
    this.status = 'maintenance';
  }
}
