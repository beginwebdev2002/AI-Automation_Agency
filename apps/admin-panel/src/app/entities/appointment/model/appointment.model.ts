export interface Service {
  id: string;
  name: string;
  category: 'Лазер' | 'Ботокс' | 'Уход за лицом';
  price: number;
  duration?: number; // in minutes
}

export interface Appointment {
  id: string;
  clientName: string;
  services: Service[];
  totalPrice: number;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Лазер всего лица', category: 'Лазер', price: 250, duration: 30 },
  { id: '2', name: 'Лазер подмышек', category: 'Лазер', price: 100, duration: 15 },
  { id: '3', name: 'Ботокс лба', category: 'Ботокс', price: 1200, duration: 45 },
  { id: '4', name: 'Чистка HydraFacial', category: 'Уход за лицом', price: 400, duration: 60 },
];
