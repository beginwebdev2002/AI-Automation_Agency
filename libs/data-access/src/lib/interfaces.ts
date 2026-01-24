export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  _id?: string;
  email: string;
  role: UserRole;
  telegramId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Venue {
  _id?: string;
  name: string;
  address: string;
  images: string[];
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface Appointment {
  _id?: string;
  user: User | string;
  venue: Venue | string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
