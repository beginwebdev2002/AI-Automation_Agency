export interface Dress {
  id: string;
  name: string;
  category: 'Wedding' | 'Evening' | 'Traditional';
  price: number;
  size: string;
  status: 'available' | 'rented' | 'cleaning';
  imageUrl: string;
}

export const MOCK_DRESSES: Dress[] = [
  { id: '1', name: 'Royal White Gown', category: 'Wedding', price: 5000, size: 'M', status: 'available', imageUrl: 'assets/dresses/wedding-1.jpg' },
  { id: '2', name: 'Emerald Evening', category: 'Evening', price: 1500, size: 'S', status: 'rented', imageUrl: 'assets/dresses/evening-1.jpg' },
  { id: '3', name: 'Traditional Atlas', category: 'Traditional', price: 800, size: 'L', status: 'available', imageUrl: 'assets/dresses/trad-1.jpg' },
  { id: '4', name: 'Golden Luxury', category: 'Evening', price: 2200, size: 'M', status: 'cleaning', imageUrl: 'assets/dresses/evening-2.jpg' },
];
