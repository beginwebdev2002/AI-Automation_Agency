export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ServiceItem {
  serviceId: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export class Booking {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly clientName: string,
    public readonly date: Date,
    public readonly items: ServiceItem[],
    public status: BookingStatus = 'pending',
    public readonly createdAt: Date = new Date()
  ) {}

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  get totalDuration(): number {
    return this.items.reduce((sum, item) => sum + item.durationMinutes, 0);
  }

  confirm(): void {
    if (this.status === 'cancelled') {
      throw new Error('Cannot confirm a cancelled booking');
    }
    this.status = 'confirmed';
  }

  complete(): void {
    if (this.status !== 'confirmed') {
      throw new Error('Booking must be confirmed before completion');
    }
    this.status = 'completed';
  }

  cancel(): void {
    if (this.status === 'completed') {
      throw new Error('Cannot cancel a completed booking');
    }
    this.status = 'cancelled';
  }
}
