/**
 * TypeScript types for frontend
 */

export interface Room {
  id: string;
  name: string;
  baseHourlyRate: number;
  capacity: number;
}

export interface Booking {
  bookingId: string;
  roomId: string;
  userName: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface CreateBookingRequest {
  roomId: string;
  userName: string;
  startTime: string;
  endTime: string;
}

export interface BookingResponse {
  bookingId: string;
  roomId: string;
  userName: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface RoomAnalytics {
  roomId: string;
  roomName: string;
  totalHours: number;
  totalRevenue: number;
}

