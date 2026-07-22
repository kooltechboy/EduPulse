import { Tier } from './academic';

export type CampusEventType = 'academic' | 'sports' | 'cultural' | 'administrative' | 'holiday' | 'exam' | 'meeting';
export type CampusEventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  type: CampusEventType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  tier: Tier;
  organizer: string;
  attendees: string[];
  status: CampusEventStatus;
}

export type RoomType = 'classroom' | 'lab' | 'auditorium' | 'office' | 'library' | 'cafeteria' | 'gymnasium';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  type: RoomType;
  amenities: string[];
  isAvailable: boolean;
}

export type AssetCategory = 'technology' | 'furniture' | 'equipment' | 'vehicle' | 'other';
export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'broken';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  serialNumber: string;
  location: string;
  condition: AssetCondition;
  assignedTo?: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  value: number;
  notes?: string;
}

export interface RouteStop {
  name: string;
  time: string;
  studentsCount: number;
  latitude: number;
  longitude: number;
}

export type TransportRouteStatus = 'active' | 'inactive';

export interface TransportRoute {
  id: string;
  name: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  capacity: number;
  currentOccupancy: number;
  stops: RouteStop[];
  status: TransportRouteStatus;
}

export type BorrowStatus = 'borrowed' | 'returned' | 'overdue';

export interface BorrowRecord {
  id?: string;
  bookId: string;
  studentId: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: BorrowStatus;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  availableCopies: number;
  location: string;
  borrowedBy: BorrowRecord[];
  coverImage?: string;
}
