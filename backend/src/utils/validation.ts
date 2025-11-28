/**
 * Validation Utilities
 * Validates booking requests and other inputs
 */

/**
 * Validate booking time range
 * Returns error message if invalid, null if valid
 */
export function validateBookingTimes(
  startTime: Date,
  endTime: Date
): string | null {
  const now = new Date();

  // Check if start time is in the past
  if (startTime < now) {
    return 'Start time cannot be in the past';
  }

  // Check if start time is before end time
  if (startTime >= endTime) {
    return 'Start time must be before end time';
  }

  // Check if duration exceeds 12 hours
  const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  if (durationHours > 12) {
    return 'Booking duration cannot exceed 12 hours';
  }

  return null;
}

/**
 * Validate date range for analytics
 */
export function validateDateRange(from: string, to: string): string | null {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime())) {
    return 'Invalid "from" date format. Use YYYY-MM-DD';
  }

  if (isNaN(toDate.getTime())) {
    return 'Invalid "to" date format. Use YYYY-MM-DD';
  }

  if (fromDate > toDate) {
    return '"from" date must be before or equal to "to" date';
  }

  return null;
}

