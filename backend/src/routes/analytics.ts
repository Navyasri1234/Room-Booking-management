/**
 * Analytics Routes
 * Handles analytics API endpoints
 * Updated to handle async MongoDB operations
 */

import { Router, Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';
import { validateDateRange } from '../utils/validation';

const router = Router();

/**
 * GET /api/analytics
 * Get room analytics for a date range
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        error: 'Missing required query parameters: from and to (format: YYYY-MM-DD)'
      });
    }

    // Validate date range
    const validationError = validateDateRange(from as string, to as string);
    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    const analytics = await analyticsService.getRoomAnalytics(from as string, to as string);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

export default router;
