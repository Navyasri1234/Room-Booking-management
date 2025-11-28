/**
 * Conflict Detection Utility
 * Checks if a new booking conflicts with existing bookings
 */

import { Booking } from '../models/Booking';

/**
 * Check if two time ranges overlap
 * Returns true if there's an overlap, false otherwise
 * Edge case: If one ends exactly when the other starts, it's NOT a conflict
 */
export function hasTimeOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  // Overlap exists if: start1 < end2 AND end1 > start2
  // But if end1 === start2 or end2 === start1, it's NOT a conflict
  return start1 < end2 && end1 > start2;
}

/**
 * Find conflicting booking for a given time range
 * Returns the conflicting booking if found, null otherwise
 */
export function findConflict(
  roomId: string,
  startTime: Date,
  endTime: Date,
  existingBookings: Booking[]
): Booking | null {
  for (const booking of existingBookings) {
    // Only check CONFIRMED bookings
    if (booking.status !== 'CONFIRMED') {
      continue;
    }

    // Check if this booking overlaps with the new time range
    if (hasTimeOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
      return booking;
    }
  }

  return null;
}

/**
 * Format conflict error message
 */
export function formatConflictMessage(conflictingBooking: Booking): string {
  const start = conflictingBooking.startTime.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const end = conflictingBooking.endTime.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `Room already booked from ${start} to ${end}`;
}

