/**
 * Booking Model
 * Represents a room booking
 */
export interface Booking {
  bookingId: string;
  roomId: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
}

/**
 * Booking creation request
 */
export interface CreateBookingRequest {
  roomId: string;
  userName: string;
  startTime: string; // ISO 8601 format
  endTime: string;   // ISO 8601 format
}

/**
 * Booking response
 */
export interface BookingResponse {
  bookingId: string;
  roomId: string;
  userName: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
}

