/**
 * Analytics Service
 * Handles analytics and reporting logic
 * Updated to use MongoDB
 */

import { getRoomsCollection, getBookingsCollection, mapRoom, mapBooking } from '../config/mongodb';
import { RoomAnalytics } from '../models/Analytics';

export class AnalyticsService {
  /**
   * Get analytics for all rooms in a date range
   * Only includes CONFIRMED bookings
   */
  async getRoomAnalytics(from: string, to: string): Promise<RoomAnalytics[]> {
    const roomsCollection = getRoomsCollection();
    const bookingsCollection = getBookingsCollection();

    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    // Get all rooms
    const roomsDocs = await roomsCollection.find({}).toArray();
    const rooms = roomsDocs.map(doc => mapRoom(doc));
    const analytics: RoomAnalytics[] = [];

    for (const room of rooms) {
      // Get all CONFIRMED bookings for this room in the date range
      const bookingsDocs = await bookingsCollection
        .find({
          roomId: room.id,
          status: 'CONFIRMED',
          startTime: {
            $gte: fromDate,
            $lte: toDate
          }
        })
        .toArray();

      const bookings = bookingsDocs.map(doc => mapBooking(doc));

      // Calculate total hours and revenue
      let totalHours = 0;
      let totalRevenue = 0;

      for (const booking of bookings) {
        const durationMs = booking.endTime.getTime() - booking.startTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        totalHours += durationHours;
        totalRevenue += booking.totalPrice;
      }

      analytics.push({
        roomId: room.id,
        roomName: room.name,
        totalHours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
        totalRevenue: Math.round(totalRevenue * 100) / 100
      });
    }

    // Sort by room ID
    return analytics.sort((a, b) => a.roomId.localeCompare(b.roomId));
  }
}

export const analyticsService = new AnalyticsService();
