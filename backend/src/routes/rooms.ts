/**
 * Room Routes
 * Handles room-related API endpoints
 * Updated to handle async MongoDB operations
 */

import { Router, Request, Response, NextFunction } from 'express';
import { roomService } from '../services/roomService';

const router = Router();

/**
 * GET /api/rooms
 * Get all rooms
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

export default router;
