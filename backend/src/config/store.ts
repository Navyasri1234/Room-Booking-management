/**
 * In-memory data store
 * In production, this would be replaced with a database
 */
import { Room } from '../models/Room';
import { Booking } from '../models/Booking';

class DataStore {
  private rooms: Map<string, Room> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private bookingCounter: number = 1;

  // Room operations
  addRoom(room: Room): void {
    this.rooms.set(room.id, room);
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  // Booking operations
  addBooking(booking: Booking): void {
    this.bookings.set(booking.bookingId, booking);
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  getBookingsByRoom(roomId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(
      booking => booking.roomId === roomId
    );
  }

  getConfirmedBookingsByRoom(roomId: string): Booking[] {
    return this.getBookingsByRoom(roomId).filter(
      booking => booking.status === 'CONFIRMED'
    );
  }

  // Generate unique booking ID
  generateBookingId(): string {
    return `b${this.bookingCounter++}`;
  }

  // Clear all data (for testing)
  clear(): void {
    this.rooms.clear();
    this.bookings.clear();
    this.bookingCounter = 1;
  }
}

export const store = new DataStore();

