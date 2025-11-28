/**
 * Error Handler Middleware
 * Handles errors and returns appropriate HTTP responses
 */

import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err.message);

  // Determine status code based on error message
  let statusCode = 500;
  if (err.message.includes('not found')) {
    statusCode = 404;
  } else if (err.message.includes('already') || err.message.includes('conflict')) {
    statusCode = 409;
  } else if (err.message.includes('cannot') || err.message.includes('Invalid') || err.message.includes('must')) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    error: err.message
  });
}

