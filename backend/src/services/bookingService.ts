/**
 * Booking Service
 * Handles all booking-related business logic
 * Updated to use MongoDB
 */

import { getBookingsCollection, getRoomsCollection, mapBooking } from '../config/mongodb';
import { Booking, CreateBookingRequest, BookingResponse } from '../models/Booking';
import { calculateBookingPrice } from '../utils/pricing';
import { findConflict, formatConflictMessage } from '../utils/conflict';
import { validateBookingTimes } from '../utils/validation';

export class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
    const bookingsCollection = getBookingsCollection();
    const roomsCollection = getRoomsCollection();

    // Parse dates
    const startTime = new Date(request.startTime);
    const endTime = new Date(request.endTime);

    // Validate times
    const validationError = validateBookingTimes(startTime, endTime);
    if (validationError) {
      throw new Error(validationError);
    }

    // Check if room exists
    const roomDoc = await roomsCollection.findOne({ id: request.roomId });
    if (!roomDoc) {
      throw new Error('Room not found');
    }

    // Check for conflicts - get CONFIRMED bookings for this room
    const existingBookingsDocs = await bookingsCollection
      .find({ 
        roomId: request.roomId,
        status: 'CONFIRMED'
      })
      .toArray();

    // Convert to Booking[] format for conflict check
    const existingBookings: Booking[] = existingBookingsDocs.map(doc => mapBooking(doc));

    const conflict = findConflict(request.roomId, startTime, endTime, existingBookings);
    if (conflict) {
      throw new Error(formatConflictMessage(conflict));
    }

    // Calculate price
    const baseHourlyRate = typeof roomDoc.baseHourlyRate === 'number' 
      ? roomDoc.baseHourlyRate 
      : parseFloat(roomDoc.baseHourlyRate);
    const totalPrice = calculateBookingPrice(startTime, endTime, baseHourlyRate);

    // Generate booking ID
    const bookingCount = await bookingsCollection.countDocuments();
    const bookingId = `b${bookingCount + 1}`;

    // Create booking document
    const booking = {
      bookingId,
      roomId: request.roomId,
      userName: request.userName,
      startTime,
      endTime,
      totalPrice,
      status: 'CONFIRMED' as const,
      createdAt: new Date()
    };

    // Insert into MongoDB
    await bookingsCollection.insertOne(booking);

    return {
      bookingId: booking.bookingId,
      roomId: booking.roomId,
      userName: booking.userName,
      totalPrice: booking.totalPrice,
      status: booking.status
    };
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    const bookingsCollection = getBookingsCollection();

    // Find booking
    const bookingDoc = await bookingsCollection.findOne({ bookingId });
    if (!bookingDoc) {
      throw new Error('Booking not found');
    }

    // Check if already cancelled
    if (bookingDoc.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }

    // Check cancellation time  constraint (>2 hours before start)
    const now = new Date();
    const startTime = bookingDoc.startTime instanceof Date 
      ? bookingDoc.startTime 
      : new Date(bookingDoc.startTime);
    const timeUntilStart = startTime.getTime() - now.getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    if (timeUntilStart <= twoHoursInMs) {
      throw new Error(
        'Cannot cancel booking. Less than 2 hours remaining before start time.'
      );
    }

    // Update status to CANCELLED
    const result = await bookingsCollection.updateOne(
      { bookingId },
      { 
        $set: { 
          status: 'CANCELLED',
          cancelledAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Failed to update booking');
    }

    const booking = mapBooking(bookingDoc);
    return {
      bookingId: booking.bookingId,
      roomId: booking.roomId,
      userName: booking.userName,
      totalPrice: booking.totalPrice,
      status: 'CANCELLED'
    };
  }

  /**
   * Get all bookings
   */
  async getAllBookings(): Promise<Booking[]> {
    const bookingsCollection = getBookingsCollection();
    const bookingsDocs = await bookingsCollection.find({}).toArray();
    
    return bookingsDocs.map(doc => mapBooking(doc));
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string): Promise<Booking | undefined> {
    const bookingsCollection = getBookingsCollection();
    const bookingDoc = await bookingsCollection.findOne({ bookingId });
    
    if (!bookingDoc) return undefined;

    return mapBooking(bookingDoc);
  }
}

export const bookingService = new BookingService();
