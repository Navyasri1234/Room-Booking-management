/**
 * Booking Routes
 * Handles booking-related API endpoints
 * Updated to handle async MongoDB operations
 */

import { Router, Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService';
import { CreateBookingRequest } from '../models/Booking';

const router = Router();

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: CreateBookingRequest = req.body;
    
    // Validate required fields
    if (!request.roomId || !request.userName || !request.startTime || !request.endTime) {
      return res.status(400).json({
        error: 'Missing required fields: roomId, userName, startTime, endTime'
      });
    }

    const booking = await bookingService.createBooking(request);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bookings/:id/cancel
 * Cancel a booking
 */
router.post('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.cancelBooking(id);
    res.json({
      bookingId: booking.bookingId,
      status: booking.status,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings
 * Get all bookings (for admin view)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

export default router;
